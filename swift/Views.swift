import SwiftUI
import PhotosUI

// MARK: - Root Flow

enum AuthScreen {
    case login
    case signup
}

struct RootView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var authScreen: AuthScreen = .login
    
    var body: some View {
        ZStack {
            if !appState.hasSeenOnboarding {
                OnboardingView {
                    withAnimation(.spring()) {
                        appState.showSignupFlow()
                        authScreen = .signup
                    }
                }
                .transition(.opacity)
            } else if !appState.isAuthenticated {
                AuthContainerView(authScreen: $authScreen)
                    .transition(.move(edge: .bottom))
            } else {
                MainAppShell()
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut, value: appState.isAuthenticated)
        .alert("Error", isPresented: .constant(appState.errorMessage != nil)) {
            Button("OK") { appState.errorMessage = nil }
        } message: {
            Text(appState.errorMessage ?? "")
        }
    }
}

// MARK: - Onboarding

struct OnboardingView: View {
    let onPrimaryAction: () -> Void
    
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(red: 0.96, green: 0.97, blue: 0.99), Color.white], startPoint: .topLeading, endPoint: .bottomTrailing)
                .ignoresSafeArea()
            VStack(spacing: 0) {
                header
                heroGrid
                copyBlock
                Spacer(minLength: 16)
                actionButtons
            }
            .frame(maxWidth: 420)
            .padding(24)
        }
    }
    
    private var header: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.blue)
                .frame(width: 44, height: 44)
                .overlay(Image(systemName: "hanger").font(.system(size: 22, weight: .bold)).foregroundColor(.white))
            Text("StyleAI")
                .font(.system(size: 22, weight: .semibold))
            Spacer()
        }
        .padding(.bottom, 28)
    }
    
    private var heroGrid: some View {
        HStack(spacing: 14) {
            onboardingImage(url: SampleData.outfits[0].images[1])
                .frame(width: 170, height: 320)
                .overlay(alignment: .bottomLeading) {
                    labelCapsule(text: "AI Styled", icon: "sparkles")
                        .padding(12)
                }
            VStack(spacing: 14) {
                onboardingImage(url: SampleData.outfits[1].images[1])
                    .frame(width: 140, height: 150)
                onboardingImage(url: SampleData.outfits[2].images[1])
                    .overlay(alignment: .center) {
                        Circle()
                            .fill(Color.white.opacity(0.9))
                            .frame(width: 44, height: 44)
                            .shadow(radius: 8)
                            .overlay(Image(systemName: "plus").font(.system(size: 18, weight: .semibold)).foregroundColor(.blue))
                    }
            }
        }
        .padding(.bottom, 32)
    }
    
    private func onboardingImage(url: String) -> some View {
        AsyncImage(url: URL(string: url)) { phase in
            switch phase {
            case .empty:
                Color.gray.opacity(0.2)
            case .success(let image):
                image.resizable().scaledToFill()
            case .failure:
                Color.gray.opacity(0.2)
            @unknown default:
                Color.gray.opacity(0.2)
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .shadow(color: Color.black.opacity(0.15), radius: 20, x: 0, y: 16)
    }
    
    private func labelCapsule(text: String, icon: String) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.blue)
            Text(text)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.primary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial, in: Capsule())
    }
    
    private var copyBlock: some View {
        VStack(spacing: 10) {
            Text("Your Personal\nAI Stylist")
                .font(.system(size: 32, weight: .bold))
                .multilineTextAlignment(.center)
            Text("Upload your wardrobe and let AI curate perfect outfits with matching accessories instantly.")
                .font(.system(size: 15))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
            HStack(spacing: 6) {
                Capsule().fill(Color.blue).frame(width: 30, height: 8)
                Circle().fill(Color.gray.opacity(0.5)).frame(width: 8, height: 8)
                Circle().fill(Color.gray.opacity(0.5)).frame(width: 8, height: 8)
            }
            .padding(.top, 8)
        }
        .padding(.bottom, 32)
    }
    
    private var actionButtons: some View {
        VStack(spacing: 12) {
            Button(action: onPrimaryAction) {
                Text("Create Account")
                    .font(.system(size: 17, weight: .semibold))
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
            }
            .buttonStyle(FilledPrimaryButtonStyle())
            Button(action: onPrimaryAction) {
                Text("I already have an account")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.white.opacity(0.7))
                    )
            }
            trustIndicator
        }
    }
    
    private var trustIndicator: some View {
        HStack(spacing: -16) {
            ForEach(0..<3) { index in
                Circle()
                    .strokeBorder(Color.white, lineWidth: 3)
                    .background(Circle().fill(Color.gray.opacity(0.3 - Double(index) * 0.08)))
                    .frame(width: 36, height: 36)
            }
            Spacer().frame(width: 12)
            Text("Loved by 50k+ fashionistas")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.secondary)
        }
        .padding(.top, 6)
    }
}

// MARK: - Auth Views

struct AuthContainerView: View {
    @EnvironmentObject var appState: DressoAppState
    @Binding var authScreen: AuthScreen
    
    var body: some View {
        VStack(spacing: 20) {
            Picker("", selection: $authScreen) {
                Text("Sign In").tag(AuthScreen.login)
                Text("Sign Up").tag(AuthScreen.signup)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, 24)
            
            if authScreen == .login {
                LoginView { authScreen = .signup }
            } else {
                SignupView { authScreen = .login }
            }
        }
        .padding(.top, 32)
    }
}

struct LoginView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var email = ""
    @State private var password = ""
    let onSwitch: () -> Void
    
    var body: some View {
        AuthCard(title: "Sign in to your account", subtitle: "or create a new account") {
            VStack(spacing: 16) {
                inputField(icon: "envelope", placeholder: "Email", text: $email)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                secureField(icon: "lock", placeholder: "Password", text: $password)
            }
            Button(action: submit) {
                if appState.isLoading {
                    ProgressView().tint(.white)
                } else {
                    Text("Sign In").font(.system(size: 17, weight: .semibold))
                }
            }
            .buttonStyle(FilledPrimaryButtonStyle())
            Button("Create new account", action: onSwitch)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.blue)
        }
        .padding(.horizontal, 24)
    }
    
    private func submit() {
        guard !email.isEmpty, !password.isEmpty else { return }
        Task { await appState.login(email: email, password: password) }
    }
}

struct SignupView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var username = ""
    @State private var email = ""
    @State private var password = ""
    let onSwitch: () -> Void
    
    var body: some View {
        AuthCard(title: "Create account", subtitle: "Join the Dresso community") {
            VStack(spacing: 16) {
                inputField(icon: "person", placeholder: "Username", text: $username)
                inputField(icon: "envelope", placeholder: "Email", text: $email)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                secureField(icon: "lock", placeholder: "Password", text: $password)
            }
            Button(action: submit) {
                if appState.isLoading {
                    ProgressView().tint(.white)
                } else {
                    Text("Sign Up").font(.system(size: 17, weight: .semibold))
                }
            }
            .buttonStyle(FilledPrimaryButtonStyle())
            Button("Already have an account? Sign in", action: onSwitch)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.blue)
        }
        .padding(.horizontal, 24)
    }
    
    private func submit() {
        guard !username.isEmpty, !email.isEmpty, !password.isEmpty else { return }
        Task { await appState.signup(username: username, email: email, password: password) }
    }
}

// Shared auth UI helpers

struct AuthCard<Content: View>: View {
    let title: String
    let subtitle: String
    @ViewBuilder var content: Content
    
    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            VStack(alignment: .leading, spacing: 6) {
                Text(title)
                    .font(.system(size: 24, weight: .bold))
                Text(subtitle)
                    .font(.system(size: 15))
                    .foregroundColor(.secondary)
            }
            content
        }
        .padding(24)
        .background(
            RoundedRectangle(cornerRadius: 24)
                .fill(Color(.systemBackground))
                .shadow(color: Color.black.opacity(0.08), radius: 18, x: 0, y: 12)
        )
    }
}

func inputField(icon: String, placeholder: String, text: Binding<String>) -> some View {
    HStack(spacing: 12) {
        Image(systemName: icon)
            .foregroundColor(.secondary)
        TextField(placeholder, text: text)
            .textFieldStyle(.plain)
            .padding(.vertical, 10)
    }
    .padding(.horizontal, 12)
    .background(RoundedRectangle(cornerRadius: 14).stroke(Color(.systemGray4)))
}

func secureField(icon: String, placeholder: String, text: Binding<String>) -> some View {
    HStack(spacing: 12) {
        Image(systemName: icon)
            .foregroundColor(.secondary)
        SecureField(placeholder, text: text)
            .textFieldStyle(.plain)
            .padding(.vertical, 10)
    }
    .padding(.horizontal, 12)
    .background(RoundedRectangle(cornerRadius: 14).stroke(Color(.systemGray4)))
}

struct FilledPrimaryButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .frame(maxWidth: .infinity)
            .frame(height: 54)
            .foregroundColor(.white)
            .background(
                RoundedRectangle(cornerRadius: 18)
                    .fill(configuration.isPressed ? Color.blue.opacity(0.8) : Color.blue)
            )
            .shadow(color: Color.blue.opacity(0.25), radius: 18, x: 0, y: 10)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
    }
}

// MARK: - Main Shell

struct MainAppShell: View {
    @EnvironmentObject var appState: DressoAppState
    
    var body: some View {
        ZStack(alignment: .bottom) {
            switch appState.selectedMainScreen {
            case .generator:
                GeneratorView()
            case .closet:
                ClosetGalleryView(outfits: SampleData.outfits)
            case .outfits:
                GeneratedOutfitDetailView()
            case .profile:
                ProfileView()
            }
            BottomNavigationBar(selected: $appState.selectedMainScreen)
        }
        .background(Color(.systemGroupedBackground))
        .task {
            await appState.loadCurrentUser()
            await appState.refreshGeneratorItems()
        }
    }
}

struct BottomNavigationBar: View {
    @Binding var selected: MainScreen
    
    private let tabs: [(MainScreen, String, String)] = [
        (.generator, "Generator", "sparkles"),
        (.closet, "Closet", "checkmark.seal"),
        (.outfits, "Outfits", "wand.and.rays"),
        (.profile, "Profile", "person")
    ]
    
    var body: some View {
        HStack {
            ForEach(tabs, id: \.0) { screen, label, systemIcon in
                Button {
                    selected = screen
                } label: {
                    VStack(spacing: 6) {
                        Image(systemName: systemIcon)
                            .font(.system(size: 20, weight: .semibold))
                            .symbolVariant(selected == screen ? .fill : .none)
                        Text(label)
                            .font(.system(size: 10, weight: selected == screen ? .bold : .medium))
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .foregroundColor(selected == screen ? Color.blue : Color.gray)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 12)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 28))
        .padding(.horizontal, 24)
        .padding(.bottom, 18)
        .shadow(color: Color.black.opacity(0.08), radius: 18, x: 0, y: 10)
    }
}

// MARK: - Generator

struct GeneratorView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var selectedPhotosItem: PhotosPickerItem?
    @State private var statusMessage: (text: String, type: MessageType)?
    
    private let filters = ["All", "Tops", "Bottoms", "Shoes", "Accessories"]
    
    var body: some View {
        VStack(spacing: 0) {
            generatorHeader
            filterChips
            statusBanner
            addItemButton
            generatorGrid
            generatorFooter
        }
        .background(Color(.systemGroupedBackground))
    }
    
    private var generatorHeader: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Outfit Creator")
                .font(.system(size: 24, weight: .bold))
            Text("Mix & match from your closet")
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 20)
        .padding(.top, 24)
    }
    
    private var filterChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(filters, id: \.self) { filter in
                    Button {
                        appState.generatorFilter = filter
                    } label: {
                        Text(filter)
                            .font(.system(size: 13, weight: .semibold))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .background(
                                Capsule()
                                    .fill(appState.generatorFilter == filter ? Color.blue : Color.white)
                                    .shadow(color: appState.generatorFilter == filter ? Color.blue.opacity(0.25) : .clear, radius: 10, x: 0, y: 6)
                            )
                            .foregroundColor(appState.generatorFilter == filter ? .white : .gray)
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
        }
    }
    
    private var statusBanner: some View {
        Group {
            if let statusMessage {
                HStack(spacing: 10) {
                    Image(systemName: statusMessage.type.icon)
                    Text(statusMessage.text)
                        .font(.system(size: 13, weight: .medium))
                    Spacer()
                }
                .padding(12)
                .background(RoundedRectangle(cornerRadius: 16).fill(statusMessage.type.background))
                .foregroundColor(statusMessage.type.foreground)
                .padding(.horizontal, 20)
            }
        }
    }
    
    private var addItemButton: some View {
        PhotosPicker(selection: $selectedPhotosItem, matching: .images) {
            VStack(spacing: 8) {
                Circle()
                    .fill(Color.blue.opacity(0.15))
                    .frame(width: 56, height: 56)
                    .overlay(Image(systemName: "camera.fill").foregroundColor(.blue))
                Text("Upload new item")
                    .font(.system(size: 15, weight: .semibold))
                Text("Add from photo library or files")
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(20)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .strokeBorder(style: StrokeStyle(lineWidth: 1, dash: [6]))
                    .foregroundColor(Color.gray.opacity(0.3))
            )
            .padding(.horizontal, 20)
            .padding(.top, 12)
        }
        .onChange(of: selectedPhotosItem) { newValue in
            guard let newValue else { return }
            Task { await handlePhotoSelection(newValue) }
        }
    }
    
    private var generatorGrid: some View {
        let items = appState.filteredGeneratorItems()
        return ScrollView {
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                ForEach(items, id: \.id) { item in
                    VStack(alignment: .leading, spacing: 8) {
                        AsyncImage(url: URL(string: item.image)) { phase in
                            switch phase {
                            case .empty:
                                ProgressView()
                                    .frame(maxWidth: .infinity, minHeight: 180)
                                    .background(Color(.secondarySystemBackground))
                                    .clipShape(RoundedRectangle(cornerRadius: 18))
                            case .success(let image):
                                image.resizable()
                                    .scaledToFill()
                                    .frame(height: 180)
                                    .clipShape(RoundedRectangle(cornerRadius: 18))
                            case .failure:
                                Image(systemName: "photo")
                                    .frame(maxWidth: .infinity, minHeight: 180)
                                    .background(Color(.secondarySystemBackground))
                                    .clipShape(RoundedRectangle(cornerRadius: 18))
                            @unknown default:
                                EmptyView()
                            }
                        }
                        Text(item.name)
                            .font(.system(size: 15, weight: .semibold))
                        Text(item.category)
                            .font(.system(size: 12))
                            .foregroundColor(.secondary)
                    }
                    .padding(12)
                    .background(RoundedRectangle(cornerRadius: 20).fill(Color(.systemBackground)))
                    .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 6)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 20)
            .padding(.bottom, 120)
        }
    }
    
    private var generatorFooter: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Selected items")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(.secondary)
                Text("Tap Generate to get AI outfits")
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button {
                statusMessage = ("Generating outfit...", .info)
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    appState.selectedOutfit = SampleData.outfits.randomElement()
                    appState.selectedMainScreen = .outfits
                    statusMessage = nil
                }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "sparkles")
                    Text("Generate")
                        .font(.system(size: 15, weight: .semibold))
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 12)
                .background(Capsule().fill(Color.blue))
                .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 16)
        .background(.ultraThinMaterial)
    }
    
    private func handlePhotoSelection(_ item: PhotosPickerItem) async {
        do {
            guard let data = try await item.loadTransferable(type: Data.self) else { return }
            let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent(UUID().uuidString + ".jpg")
            try data.write(to: tempURL)
            await appState.uploadClothing(fileURL: tempURL)
            statusMessage = ("Analyzing image with AI...", .info)
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                statusMessage = ("Upload complete!", .success)
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                    statusMessage = nil
                }
            }
        } catch {
            statusMessage = ("Upload failed: \(error.localizedDescription)", .error)
        }
    }
    
    enum MessageType {
        case success, error, info
        var icon: String {
            switch self {
            case .success: return "checkmark.circle.fill"
            case .error: return "exclamationmark.triangle.fill"
            case .info: return "info.circle.fill"
            }
        }
        var background: Color {
            switch self {
            case .success: return Color.green.opacity(0.15)
            case .error: return Color.red.opacity(0.15)
            case .info: return Color.blue.opacity(0.15)
            }
        }
        var foreground: Color {
            switch self {
            case .success: return .green
            case .error: return .red
            case .info: return .blue
            }
        }
    }
}

// MARK: - Closet

struct ClosetGalleryView: View {
    let outfits: [Outfit]
    @EnvironmentObject var appState: DressoAppState
    @State private var searchText = ""
    
    private var filteredOutfits: [Outfit] {
        guard !searchText.isEmpty else { return outfits }
        return outfits.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            closetHeader
            searchBar
            filterRow
            ScrollView {
                LazyVStack(spacing: 16) {
                    ForEach(filteredOutfits) { outfit in
                        OutfitCard(outfit: outfit)
                            .onTapGesture {
                                appState.selectedOutfit = outfit
                                appState.selectedMainScreen = .outfits
                            }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 120)
            }
        }
        .background(Color(.systemGroupedBackground))
    }
    
    private var closetHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Closet")
                    .font(.system(size: 30, weight: .bold))
                Text("\(outfits.count) saved coordinations")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button {
                appState.selectedMainScreen = .generator
            } label: {
                Image(systemName: "plus")
                    .font(.system(size: 18, weight: .bold))
                    .frame(width: 40, height: 40)
                    .background(RoundedRectangle(cornerRadius: 12).fill(Color(.systemBackground)))
                    .shadow(color: Color.black.opacity(0.08), radius: 8, x: 0, y: 4)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 24)
    }
    
    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(.secondary)
            TextField("Search outfits...", text: $searchText)
        }
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 16).fill(Color(.systemBackground)))
        .padding(.horizontal, 20)
        .padding(.top, 16)
    }
    
    private var filterRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                ForEach(["All", "Warm", "Work", "Relaxed"], id: \.self) { tag in
                    Text(tag)
                        .font(.system(size: 12, weight: .semibold))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(Capsule().fill(tag == "All" ? Color.blue : Color(.systemBackground)))
                        .foregroundColor(tag == "All" ? .white : .secondary)
                }
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
        }
    }
}

struct OutfitCard: View {
    let outfit: Outfit
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ZStack(alignment: .topTrailing) {
                RoundedRectangle(cornerRadius: 22)
                    .fill(Color(.systemBackground))
                    .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 6)
                VStack(spacing: 6) {
                    ForEach(outfit.images, id: \.self) { imageURL in
                        AsyncImage(url: URL(string: imageURL)) { phase in
                            switch phase {
                            case .empty:
                                Color(.secondarySystemBackground)
                            case .success(let image):
                                image.resizable().scaledToFill()
                            case .failure:
                                Color(.secondarySystemBackground)
                            @unknown default:
                                Color(.secondarySystemBackground)
                            }
                        }
                        .frame(height: 110)
                        .clipped()
                        .cornerRadius(18)
                    }
                }
                .padding(12)
                favoriteBadge
            }
            Text(outfit.title)
                .font(.system(size: 16, weight: .bold))
            HStack {
                Text(outfit.tag)
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(.blue)
                Spacer()
                Text("\(outfit.itemCount) items")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.secondary)
            }
        }
    }
    
    @ViewBuilder
    private var favoriteBadge: some View {
        if outfit.isFavorite {
            Image(systemName: "heart.fill")
                .foregroundColor(.red)
                .padding(8)
                .background(Circle().fill(Color.white))
                .shadow(radius: 4)
                .padding(12)
        }
    }
}

// MARK: - Generated Outfit Detail

struct GeneratedOutfitDetailView: View {
    @EnvironmentObject var appState: DressoAppState
    
    var body: some View {
        let outfit = appState.selectedOutfit ?? SampleData.outfits.first!
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                detailHeader(outfit: outfit)
                mainPhoto(outfit: outfit)
                outfitInfo(outfit: outfit)
                accessorySection(outfit: outfit)
            }
            .padding(20)
        }
        .background(Color(.systemGroupedBackground))
    }
    
    private func detailHeader(outfit: Outfit) -> some View {
        HStack {
            Button {
                appState.selectedMainScreen = .closet
            } label: {
                Image(systemName: "chevron.left")
                    .padding()
                    .background(Circle().fill(Color(.systemBackground)))
                    .shadow(radius: 4)
            }
            Spacer()
            VStack(spacing: 2) {
                Text(outfit.title)
                    .font(.system(size: 18, weight: .bold))
                Text(outfit.tag)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button(action: {}) {
                Image(systemName: "heart")
                    .padding()
                    .background(Circle().fill(Color(.systemBackground)))
                    .shadow(radius: 4)
            }
        }
    }
    
    private func mainPhoto(outfit: Outfit) -> some View {
        ZStack(alignment: .topTrailing) {
            AsyncImage(url: URL(string: outfit.images.first ?? "")) { phase in
                switch phase {
                case .empty:
                    Color(.secondarySystemBackground)
                        .frame(height: 320)
                        .clipShape(RoundedRectangle(cornerRadius: 28))
                case .success(let image):
                    image.resizable()
                        .scaledToFill()
                        .frame(height: 320)
                        .clipShape(RoundedRectangle(cornerRadius: 28))
                case .failure:
                    Color(.secondarySystemBackground)
                        .frame(height: 320)
                        .clipShape(RoundedRectangle(cornerRadius: 28))
                @unknown default:
                    EmptyView()
                }
            }
            Text("\(outfit.matchPercentage)% Match")
                .font(.system(size: 13, weight: .bold))
                .padding(10)
                .background(RoundedRectangle(cornerRadius: 16).fill(Color.white))
                .shadow(radius: 6)
                .padding(16)
        }
    }
    
    private func outfitInfo(outfit: Outfit) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(outfit.description)
                .font(.system(size: 15))
            Text("Outfit Items")
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.secondary)
            HStack(spacing: 12) {
                ForEach(outfit.images, id: \.self) { url in
                    AsyncImage(url: URL(string: url)) { phase in
                        switch phase {
                        case .empty:
                            Color(.secondarySystemBackground)
                        case .success(let image):
                            image.resizable().scaledToFill()
                        case .failure:
                            Color(.secondarySystemBackground)
                        @unknown default:
                            Color(.secondarySystemBackground)
                        }
                    }
                    .frame(width: 90, height: 90)
                    .clipShape(RoundedRectangle(cornerRadius: 18))
                }
            }
        }
    }
    
    private func accessorySection(outfit: Outfit) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recommended Accessories")
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.secondary)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(outfit.accessories) { accessory in
                        AccessoryCard(accessory: accessory)
                    }
                }
            }
        }
    }
}

struct AccessoryCard: View {
    let accessory: Outfit.Accessory
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            AsyncImage(url: URL(string: accessory.image)) { phase in
                switch phase {
                case .empty:
                    Color(.secondarySystemBackground)
                case .success(let image):
                    image.resizable().scaledToFill()
                case .failure:
                    Color(.secondarySystemBackground)
                @unknown default:
                    Color(.secondarySystemBackground)
                }
            }
            .frame(width: 120, height: 120)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(alignment: .topTrailing) {
                Image(systemName: accessory.type == "shopping" ? "bag.fill" : "hanger")
                    .padding(6)
                    .background(Circle().fill(Color.white))
                    .shadow(radius: 3)
                    .offset(x: -8, y: 8)
            }
            Text(accessory.name)
                .font(.system(size: 12, weight: .semibold))
                .lineLimit(1)
        }
        .frame(width: 130)
    }
}

// MARK: - Profile

struct ProfileView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var isEditing = false
    @State private var username = ""
    @State private var password = ""
    @State private var showImagePicker = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                profileHeader
                avatarSection
                if isEditing {
                    profileForm
                } else {
                    statGrid
                    premiumBanner
                    wardrobeList
                }
            }
            .padding(20)
        }
        .background(Color(.systemGroupedBackground))
        .onAppear {
            username = appState.user?.username ?? "Dresso User"
        }
    }
    
    private var profileHeader: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Profile")
                    .font(.system(size: 28, weight: .bold))
                Text(appState.user?.email ?? "")
                    .font(.system(size: 13))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Button(isEditing ? "Done" : "Edit") {
                withAnimation {
                    isEditing.toggle()
                }
            }
            .font(.system(size: 15, weight: .semibold))
        }
    }
    
    private var avatarSection: some View {
        VStack(spacing: 10) {
            AsyncImage(url: URL(string: appState.user?.avatar_url ?? "")) { phase in
                switch phase {
                case .empty:
                    Circle().fill(Color(.secondarySystemBackground))
                case .success(let image):
                    image.resizable().scaledToFill()
                case .failure:
                    Circle().fill(Color(.secondarySystemBackground))
                @unknown default:
                    Circle().fill(Color(.secondarySystemBackground))
                }
            }
            .frame(width: 110, height: 110)
            .clipShape(Circle())
            .overlay(alignment: .bottomTrailing) {
                Button(action: { showImagePicker = true }) {
                    Image(systemName: "camera.fill")
                        .padding(8)
                        .background(Circle().fill(Color.blue))
                        .foregroundColor(.white)
                }
            }
            Text(username)
                .font(.system(size: 20, weight: .bold))
        }
        .frame(maxWidth: .infinity)
    }
    
    private var profileForm: some View {
        VStack(spacing: 16) {
            TextField("Username", text: $username)
                .textFieldStyle(.roundedBorder)
            SecureField("New password", text: $password)
                .textFieldStyle(.roundedBorder)
            Button("Save Changes") {
                Task {
                    do {
                        _ = try await appState.client.updateUser(username: username, password: password.isEmpty ? nil : password)
                        password = ""
                        isEditing = false
                    } catch {
                        appState.errorMessage = error.localizedDescription
                    }
                }
            }
            .buttonStyle(FilledPrimaryButtonStyle())
        }
        .padding()
        .background(RoundedRectangle(cornerRadius: 20).fill(Color(.systemBackground)))
    }
    
    private var statGrid: some View {
        HStack(spacing: 12) {
            ProfileStatCard(value: "42", label: "Items")
            ProfileStatCard(value: "15", label: "Outfits")
            ProfileStatCard(value: "98%", label: "Style Score")
        }
    }
    
    private var premiumBanner: some View {
        ZStack {
            LinearGradient(gradient: Gradient(colors: [Color.black, Color.gray]), startPoint: .topLeading, endPoint: .bottomTrailing)
                .cornerRadius(24)
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Image(systemName: "diamond.fill")
                        .foregroundColor(.yellow)
                    Text("Go Premium")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                }
                Text("Get unlimited AI outfit generations and advanced analytics.")
                    .font(.system(size: 13))
                    .foregroundColor(.white.opacity(0.8))
                Button("Upgrade") {}
                    .font(.system(size: 13, weight: .bold))
                    .padding(.vertical, 6)
                    .padding(.horizontal, 14)
                    .background(Capsule().fill(Color.white))
            }
            .padding(20)
        }
    }
    
    private var wardrobeList: some View {
        VStack(spacing: 0) {
            WardrobeRow(title: "Clothes", count: "28 items", icon: "hanger")
            Divider()
            WardrobeRow(title: "Accessories", count: "14 items", icon: "sparkles")
        }
        .background(RoundedRectangle(cornerRadius: 20).fill(Color(.systemBackground)))
        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 6)
    }
}

struct ProfileStatCard: View {
    let value: String
    let label: String
    
    var body: some View {
        VStack(spacing: 6) {
            Text(value)
                .font(.system(size: 18, weight: .bold))
            Text(label)
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(16)
        .background(RoundedRectangle(cornerRadius: 18).fill(Color(.systemBackground)))
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 6)
    }
}

struct WardrobeRow: View {
    let title: String
    let count: String
    let icon: String
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .frame(width: 32, height: 32)
                .background(RoundedRectangle(cornerRadius: 10).fill(Color(.secondarySystemBackground)))
            VStack(alignment: .leading) {
                Text(title)
                    .font(.system(size: 14, weight: .semibold))
                Text(count)
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundColor(.secondary)
        }
        .padding(16)
    }
}
