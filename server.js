require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = process.env.SECRET_KEY || "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'sql_app.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    hashed_password TEXT,
    avatar_url TEXT
  )`);
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ detail: "Could not validate credentials" });

  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) return res.status(401).json({ detail: "Could not validate credentials" });
    
    const sub = payload.sub;
    db.get("SELECT * FROM users WHERE id = ? OR username = ?", [sub, sub], (err, user) => {
      if (err || !user) return res.status(401).json({ detail: "Could not validate credentials" });
      req.user = user;
      next();
    });
  });
};

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = req.path === '/users/me/avatar' 
      ? 'backend/static/avatars' 
      : 'public/images/clothing/temp';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = req.user ? `${req.user.id}_${Date.now()}${ext}` : `${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Routes
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  
  db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], (err, existing) => {
    if (existing) {
      return res.status(400).json({ detail: existing.username === username ? "Username already registered" : "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run("INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)", [username, email, hashedPassword], function(err) {
      if (err) return res.status(500).json({ detail: "Internal server error" });
      
      const token = jwt.sign({ sub: this.lastID.toString() }, SECRET_KEY, { expiresIn: '30m' });
      res.json({ access_token: token, token_type: "bearer" });
    });
  });
});

app.post('/token', (req, res) => {
  const { username, password } = req.body; // username field is email
  
  db.get("SELECT * FROM users WHERE email = ?", [username], (err, user) => {
    if (!user) return res.status(401).json({ detail: "Email not registered" });
    
    if (!bcrypt.compareSync(password, user.hashed_password)) {
      return res.status(401).json({ detail: "Incorrect password" });
    }

    const token = jwt.sign({ sub: user.id.toString() }, SECRET_KEY, { expiresIn: '30m' });
    res.json({ access_token: token, token_type: "bearer" });
  });
});

app.get('/users/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

app.put('/users/me', authenticateToken, (req, res) => {
  const { username, password } = req.body;
  let updates = [];
  let params = [];

  if (username) {
    updates.push("username = ?");
    params.push(username);
  }
  if (password) {
    updates.push("hashed_password = ?");
    params.push(bcrypt.hashSync(password, 10));
  }

  if (updates.length === 0) return res.json(req.user);

  params.push(req.user.id);
  db.run(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params, (err) => {
    if (err) return res.status(400).json({ detail: "Username already taken" });
    db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
      res.json(user);
    });
  });
});

app.post('/users/me/avatar', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });
  
  const avatarUrl = `http://localhost:${PORT}/static/avatars/${req.file.filename}`;
  db.run("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, req.user.id], (err) => {
    if (err) return res.status(500).json({ detail: "Failed to update avatar" });
    res.json({ avatar_url: avatarUrl });
  });
});

app.post('/upload-clothing', authenticateToken, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file uploaded" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ detail: "Gemini API Key not configured" });

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
    Analyze the clothing image and provide two pieces of information:
    1. Category: Determine if it's a clothing item. If NOT, reply with "NOT_CLOTHING". If it IS, classify it into exactly one of: "tops", "bottoms", "shoes", "accessories".
    2. Filename: Provide a short, descriptive, filename-friendly name for the item in 1 to 4 English words, using underscores instead of spaces (e.g., "vintage_blue_denim_jacket"). Do NOT include the file extension.
    
    Reply in this exact format:
    CATEGORY: [category or NOT_CLOTHING]
    FILENAME: [descriptive_name_with_underscores]
    `;

    const imageData = {
      inlineData: {
        data: fs.readFileSync(req.file.path).toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();
    
    const lines = text.trim().split('\n');
    const resultDict = {};
    lines.forEach(line => {
      if (line.includes(':')) {
        const [key, val] = line.split(':');
        resultDict[key.trim().toUpperCase()] = val.trim();
      }
    });

    const categoryResult = (resultDict.CATEGORY || '').toLowerCase();
    const aiFilename = resultDict.FILENAME || 'unnamed_item';

    if (categoryResult.includes('not_clothing')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ detail: "We only accept clothing images, please upload again." });
    }

    const categories = ["tops", "bottoms", "shoes", "accessories"];
    const category = categories.find(cat => categoryResult.includes(cat));

    if (!category) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ detail: "Could not categorize clothing item. Please try again." });
    }

    const uploadDir = path.join('public', 'images', 'clothing', category);
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const safeName = aiFilename.toLowerCase().replace(/\s+/g, '_');
    const extension = path.extname(req.file.originalname) || '.jpg';
    const finalFilename = `${safeName}${extension}`;
    const finalPath = path.join(uploadDir, finalFilename);

    fs.renameSync(req.file.path, finalPath);

    res.json({
      category: category,
      path: `/${finalPath.replace(/\\/g, '/')}`,
      name: aiFilename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    });
  } catch (error) {
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ detail: `AI Recognition Error: ${error.message}` });
  }
});

app.get('/clothing-items', (req, res) => {
  const items = [];
  const baseDir = path.join('public', 'images', 'clothing');
  const categories = ["tops", "bottoms", "shoes", "accessories"];

  categories.forEach(cat => {
    const catDir = path.join(baseDir, cat);
    if (fs.existsSync(catDir)) {
      const files = fs.readdirSync(catDir);
      files.forEach(filename => {
        if (/\.(png|jpg|jpeg|webp)$/i.test(filename)) {
          items.push({
            id: `${cat}_${filename}`,
            name: filename.split('_').pop().split('.')[0].replace(/^\w/, l => l.toUpperCase()),
            image: `/public/images/clothing/${cat}/${filename}`,
            category: cat.replace(/^\w/, l => l.toUpperCase()),
            isSelected: false
          });
        }
      });
    }
  });

  if (items.length === 0) {
    return res.json([
      { id: "w1", name: "White Tee", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3ufdCT2Pwvea-_RI-3Bg7lVNo96iqNmGC3ypQ-tFf7cXDdyIugB02Da--nlqWpLtOdNJnaP1V1MS7MM_U7xHKCRAGBtnaQKkPMBnv7Q_CSH5m5jC_1eZGEoH3CeMqbCqtdGbXrUmGnVItuvDTVdkzB4xIS9nBvjIxWoZVBlv_4pc7BpMmMB6dwk2o24PxSgHq9NtMwvaIx66oGPEyUKtw_lQVkCiY5NdbA5qmh-2ESjF_u5z_0szpRhnfRwgmSayDCV04ZchWJ6M", category: "Tops", isSelected: true },
      { id: "w2", name: "Denim Shorts", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdBzuHnX4YY3K62eGgSy8BrJAlN2HBfZedQnfMpmRoCZZPWZ9IRYYUExqT1IKXCKFDxLQNGvm1x_uNJuNIV6pncKBt4rAwqcckoLGTEnKV3l1nR4YPvpqeLKU2PG1PCNY3OCnwAMoYr-eraHpLFwoCaZpuRRFXPFLyzdnnWGwKkWHudtHHc2DxFPzAnQrrq96K8SSqSkA-0hssfHbmABryAWMv5EQbkSG1R088j5lrSt6oAOOQcJpXMf3ebiNgqdyjm7RLZhj1DAE", category: "Bottoms", isSelected: false },
    ]);
  }

  res.json(items);
});

// Static files
app.use('/static', express.static(path.join(__dirname, 'backend', 'static')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Fallback to index.html for SPA behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
