## Dresso Swift Playground Client (.swiftpm)

This folder contains a **Swift Package–based client** (using a `.swiftpm` package) for the Dresso backend.
Instead of using the previous iOS wrapper project, you can drive and test the backend directly from Swift Playgrounds or Xcode using SwiftPM.

### 1. Folder layout

- **`DressoClient.swiftpm/Package.swift`**: Swift Package manifest for the client.
- **`DressoClient.swiftpm/Sources/DressoClient/DressoClient.swift`**:
  - Defines a small `DressoClient` class that talks to the existing FastAPI backend.
  - Exposes high-level async methods such as `signup`, `login`, `currentUser`, `clothingItems`, `uploadAvatar`, and `uploadClothing`.
- **`DressoClient.swiftpm/Sources/DressoClient/Main.swift`**:
  - Simple executable entry point using `@main`.
  - Contains an example flow that:
    - Signs up a new user.
    - Fetches the current user profile.
    - Fetches the available clothing items.

You are free to add more targets, sources, or Swift files inside `DressoClient.swiftpm` using Xcode or the Swift Playgrounds app; these files are the starting point.

### 2. Backend prerequisites

The playground expects the Dresso backend to be running locally at **`http://localhost:8000`**.

From the project root (`Dresso`):

```bash
cd backend
pip install -r requirements.txt   # first time only
uvicorn main:app --reload
```

You should see:

```text
Uvicorn running on http://127.0.0.1:8000
```

If you run the server on a different host or port, update `dressoBaseURL` at the top of `Contents.swift`.

### 3. Opening the `.swiftpm` package

You can use either **Xcode on macOS** or the **Swift Playgrounds** app.

#### 3.1. Xcode (recommended for development)

1. Open **Xcode**.
2. Choose **File → Open…**.
3. Navigate to the repo root, then into `DressoSwiftPlayground`.
4. Select `DressoClient.swiftpm` and open it.

Xcode will show the Swift Package with the `DressoClient` target. You can run it by pressing the **Run** button for the `DressoClient` executable.

#### 3.2. Swift Playgrounds (macOS or iPadOS)

1. Open **Swift Playgrounds**.
2. Choose to open an existing app/package.
3. Navigate to `DressoSwiftPlayground/DressoClient.swiftpm` and open it.

Running behavior is the same; logs will appear in the console/log area.

### 4. What the Swift UI client does

- **`DressoClient.swift`**:
  - Handles networking to your FastAPI backend.
  - Stores an `accessToken` once you sign up or log in.
  - Exposes async functions:
    - `signup(username:email:password:)`
    - `login(email:password:)`
    - `currentUser()`
    - `updateUser(username:password:)`
    - `clothingItems()`
    - `uploadAvatar(imageFileURL:)`
    - `uploadClothing(imageFileURL:)`

- **Models**:
  - `AuthResponse` – matches the `{ access_token, token_type }` JSON returned by `/signup` and `/token`.
  - `User` – matches rows returned by `/users/me` and `/users/me/avatar`.
  - `ClothingItem` – matches items returned by `/clothing-items`.

- **`DressoAppState.swift`**:
  - `ObservableObject` that holds:
    - Authentication state (`token`, `user`).
    - Loading and error flags.
  - Wraps the networking layer and exposes high-level methods for the UI (`signup`, `login`, `fetchClothingItems`, etc.).

- **`Views.swift`**:
  - `RootView` – switches between auth screens and the closet, similar to navigating between `login.html`, `signup.html`, and `closet.html`.
  - `LoginView` – SwiftUI replica of the web `Login` screen:
    - Email and password fields.
    - "Sign In" primary button with loading state.
    - "Create New Account" link to switch to signup.
  - `SignupView` – SwiftUI replica of the web `Signup` screen:
    - Username, email, password fields.
    - "Sign Up" primary button with loading state.
    - "Already have an account? Sign In" link.
  - `ClosetView` – SwiftUI approximation of the web `Closet` screen:
    - Header showing "Closet" and number of items.
    - Search bar.
    - Scrollable list of clothing cards (`ClothingCard`) showing image, name, and category, backed by `/clothing-items`.
    - Empty-state message similar to the web version when there are no items.

- **`Main.swift`**:
  - Declares the SwiftUI entry point:
    - `@main struct DressoApp: App` that creates `DressoAppState` and renders `RootView`.

### 5. Step‑by‑step: running the Swift UI client

1. **Start the backend** (see Section 2).
2. **Open the `.swiftpm` package** in Xcode or Swift Playgrounds (Section 3).
3. Build and **Run** the app:
   - In Xcode, select the `DressoClient` scheme and press **Run**.
   - In Swift Playgrounds, tap the **Run** button.
4. You should see the **SwiftUI Sign In screen**, visually similar to the web `login.html`:
   - Enter email and password to log in, or tap **Create New Account** to go to the signup screen.
5. After successful signup/login, you will be taken to the **Closet screen**, visually mirroring the web `closet.html`:
   - The list is populated from `/clothing-items`.
   - You can search by item name.

If there is a problem (e.g., backend not running, duplicate email), the error will be surfaced in an in-app alert.

### 6. Using login instead of signup

If you already created a user with a given email/password (via the web app or a previous run), you can skip `signup` and use `login`:

1. Comment out the `signup` call in the example `Task`.
2. Replace it with:

   ```swift
   try await client.login(
       email: "your_existing_email@example.com",
       password: "your_password"
   )
   ```

3. Run the playground again.

The `accessToken` will be stored in the client and used for authenticated routes like `/users/me`, `/users/me/avatar`, and `/upload-clothing`.

### 7. Uploading an avatar from the playground

The backend exposes `POST /users/me/avatar` as a multipart upload.

The playground implements:

- `uploadAvatar(imageFileURL:)` – sends a file as `file` in a multipart form-data request, and returns the `avatar_url` string from the server.

To use it:

1. Make sure you are **already authenticated** (via `signup` or `login`).
2. Put an image file somewhere accessible from your Mac (e.g., `~/Pictures/avatar.jpg`).
3. In the example `Task`, after login/signup, add:

   ```swift
   let avatarURL = URL(fileURLWithPath: "/Users/yourname/Pictures/avatar.jpg")
   let uploadedAvatar = try await client.uploadAvatar(imageFileURL: avatarURL)
   print("Uploaded avatar URL:", uploadedAvatar)
   ```

4. Run the playground.

If the upload succeeds, the backend will:

- Store the file under `backend/static/avatars`.
- Update the current user’s `avatar_url` field.

### 8. Uploading a clothing item from the playground

The backend exposes `POST /upload-clothing` as another multipart upload, which:

- Sends an image to Google’s Gemini model for classification.
- Validates that it is a clothing item.
- Moves it into a category folder under `public/images/clothing/{tops|bottoms|shoes|accessories}`.

The playground implements:

- `uploadClothing(imageFileURL:)` – returns `(category, path, name)`.

Example usage:

```swift
let clothingImageURL = URL(fileURLWithPath: "/Users/yourname/Pictures/my_shirt.jpg")
let result = try await client.uploadClothing(imageFileURL: clothingImageURL)
print("Clothing uploaded:")
print("  Category:", result.category)
print("  Path:    ", result.path)
print("  Name:    ", result.name)
```

You can then verify:

- The file exists under `public/images/clothing/<category>/`.
- `/clothing-items` includes the new item.

### 9. Fetching and inspecting clothing items

`clothingItems()` calls the backend’s `GET /clothing-items` endpoint.

Return type:

- `[ClothingItem]` where each item includes:
  - `id`
  - `name`
  - `image` (URL or relative path)
  - `category`
  - `isSelected`

Typical usage:

```swift
let items = try await client.clothingItems()
for item in items {
    print("- \(item.name) [\(item.category)] -> \(item.image)")
}
```

If there are no local files yet, the backend may return a couple of default sample items with remote image URLs.

### 10. Changing the backend URL

If your backend is not running on `http://localhost:8000`, you can change it in one of two ways:

- **Edit the constant** at the top of `DressoClient.swift`:

  ```swift
  public let dressoBaseURL = URL(string: "http://192.168.1.10:8000")!
  ```

- **Pass a custom URL into the client**:

  ```swift
  let customURL = URL(string: "http://192.168.1.10:8000")!
  let client = DressoClient(baseURL: customURL)
  ```

Make sure the URL is reachable from the machine/device running the playground.

### 11. Notes and limitations

- This playground is intended as a **lightweight client** for:
  - Exercising and debugging backend endpoints.
  - Experimenting with authentication and uploads.
  - Inspecting clothing catalog data.
- It does **not** provide a graphical UI. All interaction is via:
  - Code edits in the playground.
  - Console output.
- If you later decide to build a full SwiftUI or UIKit app, you can reuse most of the `DressoClient` type as your networking layer.

### 12. Summary

- The previous iOS wrapper client can be replaced **for development/testing purposes** by this SwiftPM-based `.swiftpm` package.
- All client behavior now lives in:
  - `DressoSwiftPlayground/DressoClient.swiftpm/Sources/DressoClient`
- Follow the steps above to:
  - Run the backend.
  - Open the `.swiftpm` package.
  - Authenticate (signup or login).
  - Upload avatars/clothes.
  - Fetch and inspect clothing items.

### 13. Using these files in a manually created project

If you prefer to **create the Swift project yourself** (in Xcode or Swift Playgrounds) and just reuse the code, follow these steps:

- **1. Create a new SwiftUI iOS app**
  - In **Xcode**:  
    - File → New → Project… → iOS → **App** → Next.  
    - Product Name: `DressoClient` (or any name).  
    - Interface: **SwiftUI**, Language: **Swift**, Lifecycle: **SwiftUI App**.
  - In **Swift Playgrounds** (iPad or Mac):  
    - Create a new **App** project using SwiftUI.

- **2. Replace the default app entry with `DressoApp`**
  - Locate the auto-generated app file (e.g. `MyApp.swift`).
  - Replace its contents with the `DressoApp` implementation from `Main.swift`:
    - The `@main struct DressoApp: App { ... }` definition.

- **3. Add the shared state and views**
  - Create new Swift files in your project and copy the contents from:
    - `DressoAppState.swift` → defines `DressoAppState` (the `ObservableObject`).
    - `Views.swift` → defines `RootView`, `LoginView`, `SignupView`, `ClosetView`, and `ClothingCard`.
  - Make sure all of these are part of your iOS target.

- **4. Add the networking client**
  - Create another Swift file (e.g. `DressoClient.swift`) and copy the contents from:
    - `DressoSwiftPlayground/DressoClient.swiftpm/Sources/DressoClient/DressoClient.swift`.
  - At the top, confirm the base URL:
    - `public let dressoBaseURL = URL(string: "http://localhost:8000")!`  
    - Change to your backend address if needed (e.g. a LAN IP).

- **5. Build, run, and test**
  - Ensure your FastAPI backend is running as described in Section 2.
  - Build and run the app:
    - In Xcode: select an iOS simulator or device and press **Run**.
    - In Swift Playgrounds: tap **Run**.
  - You should see:
    - The **Sign In** screen (from `LoginView`).
    - Navigation to **Sign Up** (`SignupView`) and **Closet** (`ClosetView`) as you authenticate.

In short: copy `DressoClient.swift`, `DressoAppState.swift`, `Views.swift`, and the `DressoApp` definition from `Main.swift` into your manually created SwiftUI app, then run it against your existing backend.
