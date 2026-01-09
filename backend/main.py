from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
import shutil
import os
from . import models, schemas, auth, database
import google.generativeai as genai
from PIL import Image
import io
from dotenv import load_dotenv

load_dotenv()

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, specify domains.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        sub: str = payload.get("sub")
        if sub is None:
            raise credentials_exception
        
        # Try finding by ID first (new token format)
        if sub.isdigit():
            user = db.query(models.User).filter(models.User.id == int(sub)).first()
            if user:
                return user
        
        # Fallback to finding by username (old token format)
        user = db.query(models.User).filter(models.User.username == sub).first()
        if user:
            return user
            
        raise credentials_exception
    except auth.JWTError:
        raise credentials_exception

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user_username = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # The OAuth2PasswordRequestForm's 'username' field will be used for the email
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email not registered",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.username:
        # Check if username exists
        existing_user = db.query(models.User).filter(models.User.username == user_update.username).first()
        if existing_user and existing_user.id != current_user.id:
             raise HTTPException(status_code=400, detail="Username already taken")
        current_user.username = user_update.username
        
    if user_update.password:
        current_user.hashed_password = auth.get_password_hash(user_update.password)
    
    try:
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during update")

@app.post("/users/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...), 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    upload_dir = "backend/static/avatars"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_location = f"{upload_dir}/{current_user.id}_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Generate URL (assuming running on localhost:8000)
    avatar_url = f"http://localhost:8000/static/avatars/{current_user.id}_{file.filename}"
    current_user.avatar_url = avatar_url
    db.commit()
    db.refresh(current_user)
    return {"avatar_url": avatar_url}

@app.post("/upload-clothing")
async def upload_clothing(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Read image
    content = await file.read()
    try:
        image = Image.open(io.BytesIO(content))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image format")
    
    # 2. Gemini Classification
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        # For demo purposes, if no API key, let's just save it to 'tops' if it's a valid image
        # but the prompt specifically asked for Gemini-3-Flash. 
        # I will raise an error if not configured, as per instructions.
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    
    genai.configure(api_key=api_key)
    # Using gemini-3-flash-preview as requested
    model = genai.GenerativeModel('gemini-3-flash-preview') 
    
    prompt = """
    Analyze the clothing image and provide two pieces of information:
    1. Category: Determine if it's a clothing item. If NOT, reply with "NOT_CLOTHING". If it IS, classify it into exactly one of: "tops", "bottoms", "shoes", "accessories".
    2. Filename: Provide a short, descriptive, filename-friendly name for the item in 1 to 4 English words, using underscores instead of spaces (e.g., "vintage_blue_denim_jacket"). Do NOT include the file extension.
    
    Reply in this exact format:
    CATEGORY: [category or NOT_CLOTHING]
    FILENAME: [descriptive_name_with_underscores]
    """
    
    try:
        response = model.generate_content([prompt, image])
        lines = response.text.strip().split('\n')
        result_dict = {}
        for line in lines:
            if ':' in line:
                key, val = line.split(':', 1)
                result_dict[key.strip().upper()] = val.strip()
        
        category_result = result_dict.get('CATEGORY', '').lower()
        ai_filename = result_dict.get('FILENAME', 'unnamed_item')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Recognition Error: {str(e)}")
    
    if "not_clothing" in category_result:
        raise HTTPException(status_code=400, detail="We only accept clothing images, please upload again.")
    
    categories = ["tops", "bottoms", "shoes", "accessories"]
    category = next((cat for cat in categories if cat in category_result), None)
    
    if not category:
        raise HTTPException(status_code=400, detail="Could not categorize clothing item. Please try again.")
    
    # 3. Save to folder
    upload_dir = f"public/images/clothing/{category}"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Use the filename exactly as Gemini returned it (sanitizing slightly just in case)
    safe_name = ai_filename.lower().replace(" ", "_")
    extension = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{safe_name}{extension}"
    file_path = os.path.join(upload_dir, filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(content)
        
    return {"category": category, "path": f"/{file_path}", "name": ai_filename.replace("_", " ").capitalize()}

@app.get("/clothing-items")
async def list_clothing_items():
    items = []
    base_dir = "public/images/clothing"
    categories = ["tops", "bottoms", "shoes", "accessories"]
    
    for cat in categories:
        cat_dir = os.path.join(base_dir, cat)
        if os.path.exists(cat_dir):
            for filename in os.listdir(cat_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                    items.append({
                        "id": f"{cat}_{filename}",
                        "name": filename.split('_')[-1].split('.')[0].capitalize(),
                        "image": f"/public/images/clothing/{cat}/{filename}",
                        "category": cat.capitalize(),
                        "isSelected": False
                    })
    
    # If no items found, return some default ones to not break UI if empty
    if not items:
        return [
            { "id": "w1", "name": "White Tee", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA3ufdCT2Pwvea-_RI-3Bg7lVNo96iqNmGC3ypQ-tFf7cXDdyIugB02Da--nlqWpLtOdNJnaP1V1MS7MM_U7xHKCRAGBtnaQKkPMBnv7Q_CSH5m5jC_1eZGEoH3CeMqbCqtdGbXrUmGnVItuvDTVdkzB4xIS9nBvjIxWoZVBlv_4pc7BpMmMB6dwk2o24PxSgHq9NtMwvaIx66oGPEyUKtw_lQVkCiY5NdbA5qmh-2ESjF_u5z_0szpRhnfRwgmSayDCV04ZchWJ6M", "category": "Tops", "isSelected": True },
            { "id": "w2", "name": "Denim Shorts", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDdBzuHnX4YY3K62eGgSy8BrJAlN2HBfZedQnfMpmRoCZZPWZ9IRYYUExqT1IKXCKFDxLQNGvm1x_uNJuNIV6pncKBt4rAwqcckoLGTEnKV3l1nR4YPvpqeLKU2PG1PCNY3OCnwAMoYr-eraHpLFwoCaZpuRRFXPFLyzdnnWGwKkWHudtHHc2DxFPzAnQrrq96K8SSqSkA-0hssfHbmABryAWMv5EQbkSG1R088j5lrSt6oAOOQcJpXMf3ebiNgqdyjm7RLZhj1DAE", "category": "Bottoms", "isSelected": False },
        ]
        
    return items

# Mount static files for avatars
app.mount("/static", StaticFiles(directory="backend/static"), name="static")
# Mount src directory for components
app.mount("/src", StaticFiles(directory="src"), name="src")
# Mount root directory for HTML files (must be last)
app.mount("/", StaticFiles(directory=".", html=True), name="root")
