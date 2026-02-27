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
            WebTheme.bgLight.ignoresSafeArea()
            Group {
                if !appState.hasSeenOnboarding {
                    OnboardingView(
                        onCreateAccount: {
                            appState.hasSeenOnboarding = true
                            authScreen = .signup
                        },
                        onLogin: {
                            appState.hasSeenOnboarding = true
                            authScreen = .login
                        }
                    )
                } else if !appState.isAuthenticated {
                    AuthPageScaffold {
                        if authScreen == .login {
                            LoginView { authScreen = .signup }
                        } else {
                            SignupView { authScreen = .login }
                        }
                    }
                } else {
                    MainAppShell()
                }
            }
        }
        .alert("Error", isPresented: .constant(appState.errorMessage != nil)) {
            Button("OK") { appState.errorMessage = nil }
        } message: {
            Text(appState.errorMessage ?? "")
        }
    }
}

// MARK: - Shared Styling

private enum WebTheme {
    static let primary = Color(hex: 0x135BEC)
    static let bgLight = Color(hex: 0xF6F6F8)
    static let darkText = Color(hex: 0x0D121B)
    static let cardBorder = Color.black.opacity(0.06)
}

private let dressoImageCDNBaseURL = URL(string: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com")!

private extension Color {
    init(hex: Int, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255.0,
            green: Double((hex >> 8) & 0xFF) / 255.0,
            blue: Double(hex & 0xFF) / 255.0,
            opacity: alpha
        )
    }
}

private func displayFont(_ size: CGFloat, _ weight: Font.Weight = .regular) -> Font {
    .custom("Plus Jakarta Sans", size: size).weight(weight)
}

private struct LiquidGlassCard: ViewModifier {
    var cornerRadius: CGFloat = 14
    var strokeOpacity: Double = 0.42
    
    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(Color.white.opacity(strokeOpacity), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.1), radius: 12, x: 0, y: 6)
    }
}

private extension View {
    func liquidGlassCard(cornerRadius: CGFloat = 14, strokeOpacity: Double = 0.42) -> some View {
        modifier(LiquidGlassCard(cornerRadius: cornerRadius, strokeOpacity: strokeOpacity))
    }
}

private struct AppOuterShell<Content: View>: View {
    @ViewBuilder var content: Content
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.05).ignoresSafeArea()
            content
        }
    }
}

private struct PhoneShell<Content: View>: View {
    @ViewBuilder var content: Content
    
    var body: some View {
        VStack {
            content
        }
        .frame(maxWidth: 448)
        .frame(maxHeight: .infinity)
        .background(Color.white)
        .clipShape(RoundedRectangle(cornerRadius: 0))
        .shadow(color: Color.black.opacity(0.12), radius: 18, x: 0, y: 8)
        .padding(.horizontal, 0)
    }
}

private struct AuthPageScaffold<Content: View>: View {
    @ViewBuilder var content: Content
    
    var body: some View {
        ZStack {
            WebTheme.bgLight.ignoresSafeArea()
            content
                .padding(16)
        }
    }
}

private struct ScreenHeaderDivider: View {
    var body: some View {
        Rectangle()
            .fill(Color.gray.opacity(0.15))
            .frame(height: 1)
    }
}

private func imageURL(_ raw: String) -> URL? {
    let value = raw.trimmingCharacters(in: .whitespacesAndNewlines)
    guard !value.isEmpty else { return nil }
    
    if value.hasPrefix("http://") || value.hasPrefix("https://") {
        if let url = URL(string: value),
           let host = url.host?.lowercased() {
            let useCDN = url.path.hasPrefix("/public/images/")
                || url.path.hasPrefix("/images/")
                || url.path.hasPrefix("/assets/")
            if host == "localhost" || host == "127.0.0.1" {
                var components = URLComponents(url: useCDN ? dressoImageCDNBaseURL : dressoBaseURL, resolvingAgainstBaseURL: false)
                components?.path = useCDN ? url.path.replacingOccurrences(of: "/public", with: "") : url.path
                components?.query = url.query
                components?.fragment = url.fragment
                return components?.url
            }
            if useCDN && (host.contains("api.dresso.online") || host.contains("dresso.online")) {
                var components = URLComponents(url: dressoImageCDNBaseURL, resolvingAgainstBaseURL: false)
                components?.path = url.path.replacingOccurrences(of: "/public", with: "")
                components?.query = url.query
                components?.fragment = url.fragment
                return components?.url
            }
            if host.contains("lh3.googleusercontent.com") && value.contains("/aida-public/") {
                return nil
            }
        }
        return URL(string: value)
    }
    
    if value.hasPrefix("//") {
        return URL(string: "https:\(value)")
    }
    
    if value.hasPrefix("/public/images/") {
        return URL(string: value.replacingOccurrences(of: "/public", with: ""), relativeTo: dressoImageCDNBaseURL)
    }
    if value.hasPrefix("/images/") || value.hasPrefix("/assets/") {
        return URL(string: value, relativeTo: dressoImageCDNBaseURL)
    }
    if value.hasPrefix("/") {
        return URL(string: value, relativeTo: dressoBaseURL)
    }
    
    if value.hasPrefix("public/images/") {
        return URL(string: "/\(value.replacingOccurrences(of: "public/", with: ""))", relativeTo: dressoImageCDNBaseURL)
    }
    if value.hasPrefix("images/") || value.hasPrefix("assets/") {
        return URL(string: "/\(value)", relativeTo: dressoImageCDNBaseURL)
    }
    
    if value.hasPrefix("public/")
        || value.hasPrefix("backend/")
        || value.hasPrefix("static/") {
        return URL(string: "/\(value)", relativeTo: dressoBaseURL)
    }
    
    if value.contains("/") {
        return URL(string: "/\(value)", relativeTo: dressoBaseURL)
    }
    
    return URL(string: value)
}

private func generatorFallbackImage(for category: String, itemName: String? = nil) -> String {
    if let itemName {
        switch itemName.lowercased() {
        case "white tee":
            return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/assets/white-tee-placeholder.png"
        case "denim shorts":
            return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/assets/denim-shorts-placeholder.png"
        default:
            break
        }
    }

    switch category.lowercased() {
    case "tops":
        return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/tops/white-blouse-placeholder.png"
    case "bottoms":
        return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/casual-shorts-placeholder.png"
    case "shoes":
        return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/shoes/white-sneakers-placeholder.png"
    default:
        return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/accessories/sunglasses-placeholder.png"
    }
}

private func normalizedGeneratorImagePath(_ raw: String, category: String, itemName: String? = nil) -> String {
    if raw.contains("lh3.googleusercontent.com") && raw.contains("/aida-public/") {
        return generatorFallbackImage(for: category, itemName: itemName)
    }
    if imageURL(raw) == nil {
        return generatorFallbackImage(for: category, itemName: itemName)
    }
    return raw
}

private struct RemoteImage: View {
    let urlString: String
    var contentMode: ContentMode = .fill
    var placeholder: Color = Color.gray.opacity(0.12)
    
    var body: some View {
        AsyncImage(url: imageURL(urlString)) { phase in
            switch phase {
            case .empty:
                placeholder
            case .success(let image):
                image.resizable().aspectRatio(contentMode: contentMode)
            case .failure:
                placeholder
                    .overlay(Image(systemName: "photo").foregroundColor(.gray.opacity(0.6)))
            @unknown default:
                placeholder
            }
        }
    }
}

// MARK: - Onboarding (matches static web layout)

struct OnboardingView: View {
    let onCreateAccount: () -> Void
    let onLogin: () -> Void
    
    private let trustAvatars: [String] = [
        SampleData.outfits[safe: 0]?.accessories[safe: 0]?.image ?? "",
        SampleData.outfits[safe: 1]?.images[safe: 1] ?? "",
        SampleData.outfits[safe: 2]?.images[safe: 1] ?? ""
    ]
    
    var body: some View {
        VStack(spacing: 0) {
            header
            mainContent
            footer
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(WebTheme.bgLight)
    }
    
    private var header: some View {
        HStack(spacing: 8) {
            Spacer()
            RoundedRectangle(cornerRadius: 8)
                .fill(WebTheme.primary)
                .frame(width: 32, height: 32)
                .overlay(Image(systemName: "hanger").foregroundColor(.white).font(.system(size: 16, weight: .semibold)))
            Text("StyleAI")
                .font(displayFont(18, .bold))
                .foregroundColor(WebTheme.darkText)
            Spacer()
        }
        .padding(.top, 32)
        .padding(.bottom, 12)
        .padding(.horizontal, 24)
    }
    
    private var mainContent: some View {
        GeometryReader { proxy in
            let heroHeight = min(max(proxy.size.height * 0.42, 260), 340)
            let availableWidth = proxy.size.width - 32
            let heroWidth = min(max(availableWidth, 266), 296)
            VStack(spacing: 0) {
                heroGrid(height: heroHeight, totalWidth: heroWidth)
                copyBlock
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        }
    }
    
    private func heroGrid(height heroHeight: CGFloat, totalWidth: CGFloat) -> some View {
        let rightCardHeight = (heroHeight - 12) / 2
        let leftWidth = min(max(totalWidth * 0.56, 144), 160)
        let rightWidth = min(max(totalWidth * 0.34, 100), 112)
        return HStack(spacing: 16) {
            ZStack(alignment: .bottomLeading) {
                RemoteImage(urlString: SampleData.outfits[0].images[1])
                    .frame(width: leftWidth)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .overlay(Color.black.opacity(0.03))
                HStack(spacing: 6) {
                    Image(systemName: "sparkles")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(WebTheme.primary)
                    Text("AI Styled")
                        .font(displayFont(12, .semibold))
                        .foregroundColor(.black.opacity(0.8))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(.ultraThinMaterial, in: Capsule())
                .padding(12)
            }
            .frame(height: heroHeight)
            
            VStack(spacing: 16) {
                RemoteImage(urlString: SampleData.outfits[1].images[1])
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .frame(height: rightCardHeight)
                ZStack {
                    RemoteImage(urlString: SampleData.outfits[2].images[1])
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    Circle()
                        .fill(.ultraThinMaterial)
                        .frame(width: 40, height: 40)
                        .shadow(color: .black.opacity(0.15), radius: 8, x: 0, y: 4)
                        .overlay(Image(systemName: "plus").foregroundColor(WebTheme.primary))
                }
                .frame(height: rightCardHeight)
            }
            .frame(width: rightWidth)
        }
        .padding(.top, 8)
        .frame(width: totalWidth)
        .frame(maxWidth: .infinity)
    }
    
    private var copyBlock: some View {
        VStack(spacing: 0) {
            Text("Your Personal")
                .font(displayFont(32, .bold))
                .foregroundColor(WebTheme.darkText)
            VStack(spacing: 0) {
                Text("AI Stylist")
                    .font(displayFont(32, .bold))
                    .foregroundColor(WebTheme.primary)
                UnevenCapsuleUnderline()
                    .fill(WebTheme.primary.opacity(0.2))
                    .frame(width: 152, height: 8)
                    .offset(y: -4)
            }
            .padding(.bottom, 6)
            
            Text("Upload your wardrobe and let our AI curate perfect outfits with matching accessories instantly.")
                .font(displayFont(16, .regular))
                .foregroundColor(Color.gray)
                .multilineTextAlignment(.center)
                .frame(maxWidth: 320)
                .padding(.horizontal, 24)
            
            HStack(spacing: 8) {
                Capsule().fill(WebTheme.primary).frame(width: 32, height: 8)
                Circle().fill(Color(hex: 0xCFD7E7)).frame(width: 8, height: 8)
                Circle().fill(Color(hex: 0xCFD7E7)).frame(width: 8, height: 8)
            }
            .padding(.top, 24)
            .padding(.bottom, 16)
        }
        .padding(.top, 16)
    }
    
    private var footer: some View {
        VStack(spacing: 12) {
            Button(action: onCreateAccount) {
                Text("Create Account")
                    .font(displayFont(17, .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(RoundedRectangle(cornerRadius: 12).fill(WebTheme.primary))
                    .shadow(color: WebTheme.primary.opacity(0.28), radius: 12, x: 0, y: 6)
            }
            
            Button(action: onLogin) {
                Text("I already have an account")
                    .font(displayFont(16, .semibold))
                    .foregroundColor(Color.gray)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
            }
            .background(Color.clear)
            .contentShape(Rectangle())
            
            HStack(spacing: 8) {
                HStack(spacing: -8) {
                    ForEach(Array(trustAvatars.enumerated()), id: \.offset) { pair in
                        let url = pair.element
                        RemoteImage(urlString: url)
                            .frame(width: 24, height: 24)
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.white, lineWidth: 2))
                    }
                }
                Text("Loved by 50k+ fashionistas")
                    .font(displayFont(12, .medium))
                    .foregroundColor(Color.gray)
            }
            .opacity(0.6)
            .padding(.top, 8)
        }
        .padding(.horizontal, 24)
        .padding(.bottom, 28)
        .padding(.top, 4)
    }
}

private struct UnevenCapsuleUnderline: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: rect.midY))
        path.addQuadCurve(
            to: CGPoint(x: rect.maxX, y: rect.midY),
            control: CGPoint(x: rect.midX, y: rect.maxY)
        )
        return path.strokedPath(.init(lineWidth: 3, lineCap: .round))
    }
}

// MARK: - Auth Screens

struct LoginView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var email = ""
    @State private var password = ""
    let onSwitch: () -> Void
    
    var body: some View {
        VStack {
            VStack(spacing: 0) {
                VStack(spacing: 8) {
                    Text("Sign in to your account")
                        .font(displayFont(30, .bold))
                        .foregroundColor(.black.opacity(0.9))
                        .multilineTextAlignment(.center)
                    HStack(spacing: 4) {
                        Text("Or")
                            .font(displayFont(14, .regular))
                            .foregroundColor(Color.gray)
                        Button("create a new account", action: onSwitch)
                            .font(displayFont(14, .medium))
                            .foregroundColor(WebTheme.primary)
                    }
                }
                .padding(.top, 24)
                
                VStack(spacing: 16) {
                    VStack(spacing: 12) {
                        authTextField("Email address", text: $email, isSecure: false)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                        authTextField("Password", text: $password, isSecure: true)
                    }
                    
                    if let error = appState.errorMessage, !error.isEmpty {
                        Text(error)
                            .font(displayFont(14, .regular))
                            .foregroundColor(.red)
                            .frame(maxWidth: .infinity, alignment: .center)
                    }
                    
                    Button(action: submit) {
                        Text(appState.isLoading ? "Signing in..." : "Sign in")
                            .font(displayFont(14, .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 40)
                            .background(RoundedRectangle(cornerRadius: 8).fill(WebTheme.primary))
                    }
                    .disabled(appState.isLoading)
                    .opacity(appState.isLoading ? 0.6 : 1)
                }
                .padding(.top, 32)
            }
            .padding(32)
            .frame(maxWidth: 420)
            .liquidGlassCard(cornerRadius: 16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
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
        VStack {
            VStack(spacing: 0) {
                VStack(spacing: 8) {
                    Text("Create an account")
                        .font(displayFont(30, .bold))
                        .foregroundColor(.black.opacity(0.9))
                        .multilineTextAlignment(.center)
                    HStack(spacing: 4) {
                        Text("Or")
                            .font(displayFont(14, .regular))
                            .foregroundColor(Color.gray)
                        Button("sign in to your existing account", action: onSwitch)
                            .font(displayFont(14, .medium))
                            .foregroundColor(WebTheme.primary)
                    }
                }
                .padding(.top, 24)
                
                VStack(spacing: 16) {
                    VStack(spacing: 12) {
                        authTextField("Username", text: $username, isSecure: false)
                        authTextField("Email address", text: $email, isSecure: false)
                            .keyboardType(.emailAddress)
                            .textInputAutocapitalization(.never)
                        authTextField("Password", text: $password, isSecure: true)
                    }
                    
                    if let error = appState.errorMessage, !error.isEmpty {
                        Text(error)
                            .font(displayFont(14, .regular))
                            .foregroundColor(.red)
                            .frame(maxWidth: .infinity, alignment: .center)
                    }
                    
                    Button(action: submit) {
                        Text(appState.isLoading ? "Creating account..." : "Sign up")
                            .font(displayFont(14, .semibold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 40)
                            .background(RoundedRectangle(cornerRadius: 8).fill(WebTheme.primary))
                    }
                    .disabled(appState.isLoading)
                    .opacity(appState.isLoading ? 0.6 : 1)
                }
                .padding(.top, 32)
            }
            .padding(32)
            .frame(maxWidth: 420)
            .liquidGlassCard(cornerRadius: 16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    private func submit() {
        guard !username.isEmpty, !email.isEmpty, !password.isEmpty else { return }
        Task { await appState.signup(username: username, email: email, password: password) }
    }
}

private func authTextField(_ placeholder: String, text: Binding<String>, isSecure: Bool) -> some View {
    Group {
        if isSecure {
            SecureField(placeholder, text: text)
        } else {
            TextField(placeholder, text: text)
        }
    }
    .font(displayFont(14, .regular))
    .padding(.horizontal, 12)
    .padding(.vertical, 10)
    .liquidGlassCard(cornerRadius: 10, strokeOpacity: 0.28)
}

// MARK: - Main App Shell (phone shell + nav + detail route)

struct MainAppShell: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var didInitialLoad = false
    
    var body: some View {
        ZStack {
            WebTheme.bgLight.ignoresSafeArea()
            Group {
                if appState.isShowingOutfitDetail {
                    GeneratedOutfitDetailView()
                } else {
                    tabContent
                        .safeAreaInset(edge: .bottom, spacing: 0) {
                            VStack(spacing: 0) {
                                if appState.selectedMainScreen == .generator {
                                    GeneratorActionBar()
                                }
                                BottomNavigationBar(selected: $appState.selectedMainScreen)
                            }
                        }
                }
            }
        }
        .task {
            guard !didInitialLoad else { return }
            didInitialLoad = true
            await appState.loadCurrentUser()
            await appState.refreshGeneratorItems()
        }
    }
    
    @ViewBuilder
    private var tabContent: some View {
        switch appState.selectedMainScreen {
        case .generator:
            GeneratorView()
        case .closet:
            ClosetGalleryView(outfits: SampleData.outfits)
        case .profile:
            ProfileView()
        }
    }
    
}

struct BottomNavigationBar: View {
    @Binding var selected: MainScreen
    @Namespace private var liquidGlassTabNamespace
    
    private let items: [(MainScreen, String, String)] = [
        (.generator, "Generator", "sparkles"),
        (.closet, "Closet", "tshirt"),
        (.profile, "Profile", "person")
    ]
    
    var body: some View {
        HStack(spacing: 8) {
            ForEach(items, id: \.0) { item in
                let isActive = selected == item.0
                Button {
                    withAnimation(.spring(response: 0.4, dampingFraction: 0.82)) {
                        selected = item.0
                    }
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: item.2)
                            .font(.system(size: 18, weight: .semibold))
                            .symbolVariant(isActive ? .fill : .none)
                        Text(item.1)
                            .font(displayFont(10, isActive ? .bold : .medium))
                    }
                    .foregroundColor(isActive ? WebTheme.primary : Color.gray)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(
                        ZStack {
                            if isActive {
                                Capsule()
                                    .fill(.ultraThinMaterial)
                                    .overlay(Capsule().stroke(Color.white.opacity(0.45), lineWidth: 1))
                                    .matchedGeometryEffect(id: "liquid-tab-pill", in: liquidGlassTabNamespace)
                            }
                        }
                    )
                }
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())
        .overlay(
            Capsule()
                .stroke(Color.white.opacity(0.45), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.16), radius: 18, x: 0, y: 8)
        .padding(.horizontal, 14)
        .padding(.top, 8)
        .padding(.bottom, 6)
    }
}

// MARK: - Closet

struct ClosetGalleryView: View {
    let outfits: [Outfit]
    @EnvironmentObject var appState: DressoAppState
    @State private var searchText = ""
    @State private var selectedTag = "All"
    
    private let tags = ["All", "Warm", "Work", "Relaxed"]
    
    private var filteredOutfits: [Outfit] {
        outfits.filter { outfit in
            let matchesSearch = searchText.isEmpty || outfit.title.localizedCaseInsensitiveContains(searchText)
            let matchesTag = selectedTag == "All" || outfit.tag.localizedCaseInsensitiveContains(selectedTag)
            return matchesSearch && matchesTag
        }
    }
    
    private var leftColumn: [Outfit] {
        filteredOutfits.enumerated().compactMap { $0.offset.isMultiple(of: 2) ? $0.element : nil }
    }
    
    private var rightColumn: [Outfit] {
        filteredOutfits.enumerated().compactMap { !$0.offset.isMultiple(of: 2) ? $0.element : nil }
    }
    
    var body: some View {
        VStack(spacing: 0) {
            closetHeader
            searchFilters
            ScrollView {
                HStack(alignment: .top, spacing: 12) {
                    VStack(spacing: 12) {
                        ForEach(leftColumn) { outfit in
                            ClosetMasonryCard(outfit: outfit) {
                                appState.selectedOutfit = outfit
                                appState.isShowingOutfitDetail = true
                            }
                        }
                    }
                    VStack(spacing: 12) {
                        ForEach(rightColumn) { outfit in
                            ClosetMasonryCard(outfit: outfit) {
                                appState.selectedOutfit = outfit
                                appState.isShowingOutfitDetail = true
                            }
                        }
                    }
                }
                .padding(.horizontal, 12)
                .padding(.top, 8)
                .padding(.bottom, 16)
            }
        }
        .background(WebTheme.bgLight)
    }
    
    private var closetHeader: some View {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Closet")
                        .font(displayFont(24, .bold))
                        .foregroundColor(WebTheme.darkText)
                    Text("\(outfits.count) Saved coordinations")
                        .font(displayFont(12, .medium))
                        .foregroundColor(Color.gray)
                }
                Spacer()
                Button {
                    appState.selectedMainScreen = .generator
                } label: {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(.ultraThinMaterial)
                        .frame(width: 40, height: 40)
                        .overlay(Image(systemName: "plus").foregroundColor(WebTheme.darkText))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.white.opacity(0.42), lineWidth: 1))
                        .shadow(color: .black.opacity(0.06), radius: 4, x: 0, y: 2)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(.ultraThinMaterial)
            ScreenHeaderDivider()
        }
    }
    
    private var searchFilters: some View {
        VStack(spacing: 10) {
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                TextField("Search outfits...", text: $searchText)
                    .font(displayFont(14, .regular))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .liquidGlassCard(cornerRadius: 12, strokeOpacity: 0.3)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(tags, id: \.self) { tag in
                        Button {
                            selectedTag = tag
                        } label: {
                            HStack(spacing: 6) {
                                if tag != "All" {
                                    Circle()
                                        .fill(tagDotColor(tag))
                                        .frame(width: 6, height: 6)
                                }
                                Text(tag)
                                    .font(displayFont(12, selectedTag == tag ? .semibold : .medium))
                            }
                            .foregroundColor(selectedTag == tag ? .white : Color.gray)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 7)
                            .background(
                                Group {
                                    if selectedTag == tag {
                                        Capsule().fill(WebTheme.primary)
                                    } else {
                                        Capsule().fill(.ultraThinMaterial)
                                    }
                                }
                            )
                            .overlay(
                                Capsule().stroke(selectedTag == tag ? .clear : Color.white.opacity(0.42), lineWidth: 1)
                            )
                            .shadow(color: selectedTag == tag ? WebTheme.primary.opacity(0.16) : .clear, radius: 8, x: 0, y: 4)
                        }
                    }
                }
                .padding(.vertical, 2)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 12)
        .padding(.bottom, 8)
        .background(WebTheme.bgLight)
    }
    
    private func tagDotColor(_ tag: String) -> Color {
        switch tag {
        case "Warm": return .orange
        case "Work": return .purple
        case "Relaxed": return .teal
        default: return .clear
        }
    }
}

private struct ClosetMasonryCard: View {
    let outfit: Outfit
    let onTap: () -> Void
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 0) {
                collage
                info
            }
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .liquidGlassCard(cornerRadius: 12, strokeOpacity: 0.3)
        }
        .buttonStyle(.plain)
    }
    
    private var collage: some View {
        ZStack(alignment: .topTrailing) {
            GeometryReader { proxy in
                let height = proxy.size.width * (4.0 / 3.0)
                VStack(spacing: 2) {
                    RemoteImage(urlString: outfit.images[safe: 0] ?? "")
                        .frame(height: height * 0.5 - 1)
                        .clipped()
                    HStack(spacing: 2) {
                        RemoteImage(urlString: outfit.images[safe: 1] ?? "")
                        RemoteImage(urlString: outfit.images[safe: 2] ?? "")
                    }
                    .frame(height: height * 0.5 - 1)
                }
                .frame(height: height)
            }
            .aspectRatio(3.0/4.0, contentMode: .fit)
            .clipped()
            
            if outfit.isFavorite {
                Circle()
                    .fill(.ultraThinMaterial)
                    .frame(width: 24, height: 24)
                    .overlay(Image(systemName: "heart.fill").font(.system(size: 12)).foregroundColor(.red))
                    .padding(8)
            }
            
            if !outfit.description.isEmpty {
                VStack {
                    Spacer()
                    HStack {
                        Text(outfit.description)
                            .font(displayFont(10, .bold))
                            .foregroundColor(.black.opacity(0.75))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 6))
                        Spacer()
                    }
                    .padding(8)
                }
            }
        }
    }
    
    private var info: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(outfit.title)
                .font(displayFont(14, .bold))
                .foregroundColor(.black.opacity(0.9))
                .lineLimit(2)
            HStack {
                Text(outfit.tag.uppercased())
                    .font(displayFont(10, .semibold))
                    .foregroundColor(tagColor(outfit.tag))
                Spacer()
                Text("\(outfit.itemCount) items")
                    .font(displayFont(10, .medium))
                    .foregroundColor(.gray)
            }
        }
        .padding(12)
    }
    
    private func tagColor(_ tag: String) -> Color {
        switch tag.lowercased() {
        case "warm": return .orange
        case "work": return .purple
        case "relaxed": return .teal
        case "romantic": return .pink
        default: return WebTheme.primary
        }
    }
}

// MARK: - Generator

@MainActor
struct GeneratorView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var selectedPhotosItem: PhotosPickerItem?
    @State private var message: BannerMessage?
    
    private let filters = ["All", "Tops", "Bottoms", "Shoes", "Accessories"]
    
    var body: some View {
        VStack(spacing: 0) {
            generatorHeader
            ScrollView {
                VStack(spacing: 0) {
                    filterChips
                    if let message {
                        statusBanner(message)
                            .padding(.horizontal, 20)
                            .padding(.bottom, 16)
                    }
                    uploadPanel
                        .padding(.horizontal, 20)
                        .padding(.bottom, 24)
                    gridSection
                        .padding(.horizontal, 20)
                        .padding(.bottom, 24)
                }
                .padding(.top, 8)
            }
        }
        .background(WebTheme.bgLight)
    }
    
    private var generatorHeader: some View {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Outfit Creator")
                        .font(displayFont(24, .bold))
                    Text("Mix & match from your closet")
                        .font(displayFont(12, .medium))
                        .foregroundColor(.gray)
                }
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(WebTheme.bgLight.opacity(0.95))
            ScreenHeaderDivider()
        }
    }
    
    private var filterChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(filters, id: \.self) { f in
                    Button {
                        appState.generatorFilter = f
                    } label: {
                        Text(f)
                            .font(displayFont(14, appState.generatorFilter == f ? .semibold : .medium))
                            .foregroundColor(appState.generatorFilter == f ? .white : Color(hex: 0x64748B))
                            .padding(.horizontal, 20)
                            .frame(height: 36)
                            .background(
                                Group {
                                    if appState.generatorFilter == f {
                                        Capsule().fill(WebTheme.primary)
                                    } else {
                                        Capsule().fill(.ultraThinMaterial)
                                    }
                                }
                            )
                            .overlay(
                                Capsule().stroke(appState.generatorFilter == f ? .clear : Color.white.opacity(0.38), lineWidth: 1)
                            )
                            .shadow(color: appState.generatorFilter == f ? WebTheme.primary.opacity(0.2) : .clear, radius: 10, x: 0, y: 4)
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 20)
            .padding(.top, 8)
        }
    }
    
    private func statusBanner(_ message: BannerMessage) -> some View {
        HStack(spacing: 8) {
            if message.spinning {
                ProgressView()
                    .scaleEffect(0.8)
                    .tint(message.textColor)
            }
            Text(message.text)
                .font(displayFont(14, .medium))
            Spacer()
        }
        .padding(12)
        .background(RoundedRectangle(cornerRadius: 12).fill(message.bgColor))
        .foregroundColor(message.textColor)
    }
    
    private var uploadPanel: some View {
        let isUploading = appState.isGeneratorLoading
        return PhotosPicker(selection: $selectedPhotosItem, matching: .images) {
            VStack(spacing: 8) {
                Circle()
                    .fill(WebTheme.primary.opacity(0.1))
                    .frame(width: 48, height: 48)
                    .overlay(Image(systemName: isUploading ? "arrow.triangle.2.circlepath" : "camera")
                        .font(.system(size: 22))
                        .foregroundColor(WebTheme.primary))
                Text(isUploading ? "Uploading..." : "Add New Item")
                    .font(displayFont(14, .semibold))
                    .foregroundColor(.black.opacity(0.9))
                Text("Upload from gallery or camera")
                    .font(displayFont(12, .regular))
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 28)
            .liquidGlassCard(cornerRadius: 12, strokeOpacity: 0.32)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(style: .init(lineWidth: 2, dash: [6]))
                .foregroundColor(Color(hex: 0xCBD5E1)))
        }
        .disabled(appState.isGeneratorLoading)
        .onChange(of: selectedPhotosItem) { _, newValue in
            guard let newValue else { return }
            Task { await handlePhotoSelection(newValue) }
        }
    }
    
    @ViewBuilder
    private var gridSection: some View {
        let items = appState.filteredGeneratorItems()
        if appState.isGeneratorLoading && items.isEmpty {
            VStack {
                ProgressView()
                    .scaleEffect(1.2)
                    .tint(WebTheme.primary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 40)
        } else if items.isEmpty {
            VStack(spacing: 12) {
                Image(systemName: "tshirt")
                    .font(.system(size: 48))
                    .foregroundColor(Color.gray.opacity(0.35))
                Text("No items found in this category.")
                    .font(displayFont(14, .medium))
                    .foregroundColor(.gray)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 40)
        } else {
            let columns = [GridItem(.adaptive(minimum: 150, maximum: 190), spacing: 16, alignment: .top)]
            LazyVGrid(columns: columns, alignment: .center, spacing: 18) {
                ForEach(items, id: \.id) { item in
                    GeneratorItemCard(item: item, isSelected: appState.isGeneratorItemSelected(item.id)) {
                        appState.toggleGeneratorItemSelection(item.id)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)
        }
    }
    
    private func handlePhotoSelection(_ pickerItem: PhotosPickerItem) async {
        do {
            guard let data = try await pickerItem.loadTransferable(type: Data.self) else { return }
            let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("\(UUID().uuidString).jpg")
            try data.write(to: tempURL)
            await MainActor.run {
                message = BannerMessage(text: "Analyzing image...", bgColor: Color.blue.opacity(0.12), textColor: .blue, spinning: true)
            }
            await appState.uploadClothing(fileURL: tempURL)
            await MainActor.run {
                message = BannerMessage(text: "Successfully uploaded item!", bgColor: Color.green.opacity(0.12), textColor: .green, spinning: false)
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 3) { message = nil }
        } catch {
            await MainActor.run {
                message = BannerMessage(text: error.localizedDescription, bgColor: Color.red.opacity(0.12), textColor: .red, spinning: false)
            }
        }
    }
    
    private struct BannerMessage {
        let text: String
        let bgColor: Color
        let textColor: Color
        let spinning: Bool
    }
}

private struct GeneratorItemCard: View {
    let item: ClothingItem
    let isSelected: Bool
    let onTap: () -> Void
    
    private var resolvedImage: String {
        normalizedGeneratorImagePath(item.image, category: item.category, itemName: item.name)
    }
    
    var body: some View {
        Button(action: onTap) {
            ZStack(alignment: .topTrailing) {
                RemoteImage(urlString: resolvedImage)
                    .aspectRatio(3.0/4.0, contentMode: .fill)
                    .frame(maxWidth: .infinity)
                    .clipped()
                    .overlay(
                        LinearGradient(
                            colors: [.clear, .black.opacity(0.65)],
                            startPoint: .center,
                            endPoint: .bottom
                        )
                    )
                
                Circle()
                    .fill(isSelected ? WebTheme.primary : Color.black.opacity(0.25))
                    .frame(width: 26, height: 26)
                    .overlay(Image(systemName: isSelected ? "checkmark" : "plus")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white))
                    .padding(10)
                
                VStack(alignment: .leading, spacing: 2) {
                    Spacer()
                    Text(item.name)
                        .font(displayFont(13, .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text(item.category)
                        .font(displayFont(11, .regular))
                        .foregroundColor(.white.opacity(0.75))
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(14)
            }
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(isSelected ? WebTheme.primary : .clear, lineWidth: 2)
            )
            .aspectRatio(3.0/4.0, contentMode: .fit)
        }
        .buttonStyle(.plain)
    }
}

private struct GeneratorActionBar: View {
    @EnvironmentObject var appState: DressoAppState
    
    var body: some View {
        VStack(spacing: 10) {
            HStack {
                Text("Selected Items")
                    .font(displayFont(14, .medium))
                    .foregroundColor(Color(hex: 0x64748B))
                Spacer()
                Text("\(appState.selectedGeneratorItemCount) items")
                    .font(displayFont(14, .bold))
                    .foregroundColor(WebTheme.primary)
            }
            Button(action: generate) {
                HStack(spacing: 8) {
                    Image(systemName: "sparkles")
                    Text("Generate AI Look")
                        .font(displayFont(16, .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(RoundedRectangle(cornerRadius: 12).fill(WebTheme.primary))
                .shadow(color: WebTheme.primary.opacity(0.26), radius: 10, x: 0, y: 5)
            }
            .disabled(appState.selectedGeneratorItemCount == 0)
            .opacity(appState.selectedGeneratorItemCount == 0 ? 0.5 : 1)
        }
        .padding(.horizontal, 20)
        .padding(.top, 14)
        .padding(.bottom, 12)
        .liquidGlassCard(cornerRadius: 16, strokeOpacity: 0.34)
        .overlay(alignment: .top) { Divider().opacity(0.08) }
        .padding(.horizontal, 12)
    }
    
    private func generate() {
        guard appState.selectedGeneratorItemCount > 0 else { return }
        appState.selectedOutfit = SampleData.outfits.randomElement() ?? SampleData.outfits.first
        appState.isShowingOutfitDetail = true
    }
}

// MARK: - Outfit Detail

struct GeneratedOutfitDetailView: View {
    @EnvironmentObject var appState: DressoAppState
    
    var body: some View {
        let outfit = appState.selectedOutfit ?? SampleData.outfits.first!
        VStack(spacing: 0) {
            detailHeader(outfit)
            ScrollView {
                VStack(spacing: 24) {
                    outfitCard(outfit)
                }
                .padding(16)
                .padding(.bottom, 20)
            }
        }
        .background(WebTheme.bgLight)
    }
    
    private func detailHeader(_ outfit: Outfit) -> some View {
        VStack(spacing: 0) {
            HStack(spacing: 12) {
                Button {
                    appState.isShowingOutfitDetail = false
                } label: {
                    Circle()
                        .fill(Color.clear)
                        .frame(width: 40, height: 40)
                        .overlay(Image(systemName: "chevron.left").foregroundColor(Color.gray))
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(outfit.title)
                        .font(displayFont(20, .bold))
                        .foregroundColor(WebTheme.darkText)
                    Text("\(outfit.tag) Look")
                        .font(displayFont(12, .medium))
                        .foregroundColor(.gray)
                }
                Spacer()
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .background(WebTheme.bgLight.opacity(0.95))
            ScreenHeaderDivider()
        }
    }
    
    private func outfitCard(_ outfit: Outfit) -> some View {
        VStack(spacing: 0) {
            ZStack(alignment: .topLeading) {
                ZStack(alignment: .topTrailing) {
                    RemoteImage(urlString: outfit.images[safe: 0] ?? "")
                        .frame(maxWidth: .infinity)
                        .aspectRatio(4.0/5.0, contentMode: .fill)
                        .clipped()
                    VStack(spacing: 8) {
                        outfitIconCircle(icon: appState.isOutfitFavorite(outfit) ? "heart.fill" : "heart", tint: appState.isOutfitFavorite(outfit) ? .red : Color(hex: 0x94A3B8)) {
                            appState.toggleOutfitFavorite(outfit)
                        }
                        outfitIconCircle(icon: "square.and.arrow.up", tint: Color(hex: 0x475569)) {}
                    }
                    .padding(12)
                }
                HStack(spacing: 6) {
                    Image(systemName: "sparkles")
                        .foregroundColor(.green)
                    Text("\(outfit.matchPercentage)% Match")
                        .font(displayFont(12, .bold))
                        .foregroundColor(WebTheme.darkText)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(.white.opacity(0.92), in: RoundedRectangle(cornerRadius: 8))
                .shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)
                .padding(12)
            }
            
            VStack(alignment: .leading, spacing: 16) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(outfit.title)
                        .font(displayFont(20, .bold))
                        .foregroundColor(WebTheme.darkText)
                    Text(outfit.description)
                        .font(displayFont(14, .regular))
                        .foregroundColor(Color(hex: 0x64748B))
                }
                Rectangle().fill(Color.gray.opacity(0.12)).frame(height: 1)
                
                VStack(alignment: .leading, spacing: 12) {
                    Text("OUTFIT ITEMS")
                        .font(displayFont(12, .bold))
                        .foregroundColor(Color(hex: 0x94A3B8))
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 3), spacing: 12) {
                        ForEach(Array(outfit.images.enumerated()), id: \.offset) { _, img in
                            RemoteImage(urlString: img)
                                .aspectRatio(1, contentMode: .fill)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.08), lineWidth: 1))
                        }
                    }
                }
                
                if !outfit.accessories.isEmpty {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("RECOMMENDED ACCESSORIES")
                            .font(displayFont(12, .bold))
                            .foregroundColor(Color(hex: 0x94A3B8))
                        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 3), spacing: 12) {
                            ForEach(outfit.accessories) { accessory in
                                VStack(alignment: .leading, spacing: 6) {
                                    ZStack(alignment: .bottomTrailing) {
                                        RemoteImage(urlString: accessory.image)
                                            .aspectRatio(1, contentMode: .fill)
                                            .clipShape(RoundedRectangle(cornerRadius: 12))
                                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.08), lineWidth: 1))
                                        RoundedRectangle(cornerRadius: 6)
                                            .fill(accessory.type == "shopping" ? WebTheme.primary : Color.white)
                                            .frame(width: 22, height: 22)
                                            .overlay(Image(systemName: accessory.type == "shopping" ? "bag.fill" : "hanger")
                                                .font(.system(size: 10, weight: .semibold))
                                                .foregroundColor(accessory.type == "shopping" ? .white : WebTheme.primary))
                                            .padding(6)
                                    }
                                    Text(accessory.name)
                                        .font(displayFont(10, .medium))
                                        .foregroundColor(Color(hex: 0x475569))
                                        .lineLimit(1)
                                }
                            }
                        }
                    }
                }
            }
            .padding(16)
        }
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .liquidGlassCard(cornerRadius: 16, strokeOpacity: 0.34)
    }
    
    private func outfitIconCircle(icon: String, tint: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Circle()
                .fill(.ultraThinMaterial)
                .frame(width: 36, height: 36)
                .overlay(Image(systemName: icon).foregroundColor(tint))
                .shadow(color: .black.opacity(0.06), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Profile

@MainActor
struct ProfileView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var isEditing = false
    @State private var username = ""
    @State private var password = ""
    @State private var avatarPickerItem: PhotosPickerItem?
    
    var body: some View {
        VStack(spacing: 0) {
            profileHeader
            ScrollView {
                VStack(spacing: 0) {
                    profileTopSection
                    statsSection
                    premiumBanner
                    wardrobeSection
                }
                .padding(.bottom, 18)
            }
        }
        .background(WebTheme.bgLight)
        .onAppear {
            username = appState.user?.username ?? "Dresso User"
        }
        .onChange(of: avatarPickerItem) { _, newValue in
            guard let newValue else { return }
            Task { await uploadAvatar(newValue) }
        }
    }
    
    private var profileHeader: some View {
        VStack(spacing: 0) {
            HStack {
                Circle().fill(Color.clear).frame(width: 40, height: 40)
                Spacer()
                Text("Profile")
                    .font(displayFont(18, .bold))
                    .foregroundColor(WebTheme.darkText)
                Spacer()
                Button {
                    appState.logout()
                } label: {
                    Circle()
                        .fill(Color.clear)
                        .frame(width: 40, height: 40)
                        .overlay(Image(systemName: "rectangle.portrait.and.arrow.right").foregroundColor(.gray))
                }
            }
            .padding(.horizontal, 16)
            .padding(.top, 8)
            .padding(.bottom, 8)
            ScreenHeaderDivider()
        }
        .background(WebTheme.bgLight.opacity(0.95))
    }
    
    private var profileTopSection: some View {
        let avatarURL = {
            let raw = appState.user?.avatar_url?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""
            if raw.isEmpty {
                return "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/assets/profile-default-avatar-placeholder.png"
            }
            return raw
        }()
        return VStack(spacing: 16) {
            PhotosPicker(selection: $avatarPickerItem, matching: .images) {
                ZStack(alignment: .bottomTrailing) {
                    RemoteImage(urlString: avatarURL)
                        .frame(width: 112, height: 112)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color.white, lineWidth: 4))
                        .shadow(color: .black.opacity(0.12), radius: 8, x: 0, y: 4)
                    Circle()
                        .fill(WebTheme.primary)
                        .frame(width: 28, height: 28)
                        .overlay(Image(systemName: "pencil").font(.system(size: 12)).foregroundColor(.white))
                        .overlay(Circle().stroke(Color.white, lineWidth: 2))
                }
            }
            .buttonStyle(.plain)
            
            if !isEditing {
                VStack(spacing: 8) {
                    Text(appState.user?.username ?? "Dresso User")
                        .font(displayFont(24, .bold))
                        .foregroundColor(WebTheme.darkText)
                    Text(appState.user?.email ?? "No email set")
                        .font(displayFont(14, .medium))
                        .foregroundColor(.gray)
                    Text("Fashion Enthusiast")
                        .font(displayFont(12, .medium))
                        .foregroundColor(WebTheme.primary)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Capsule().fill(WebTheme.primary.opacity(0.1)))
                    Button {
                        username = appState.user?.username ?? username
                        password = ""
                        isEditing = true
                    } label: {
                        Text("Edit Profile")
                            .font(displayFont(14, .semibold))
                            .foregroundColor(WebTheme.darkText)
                            .frame(width: 200, height: 36)
                            .liquidGlassCard(cornerRadius: 8, strokeOpacity: 0.3)
                    }
                }
            } else {
                VStack(spacing: 12) {
                    profileInput("Username", text: $username)
                    profileReadOnlyInput("Email", value: appState.user?.email ?? "")
                    profileInput("New Password (optional)", text: $password, secure: true)
                    HStack(spacing: 8) {
                        Button("Save") {
                            Task {
                                await appState.updateProfile(
                                    username: username,
                                    password: password.isEmpty ? nil : password
                                )
                                password = ""
                                isEditing = false
                            }
                        }
                        .font(displayFont(14, .semibold))
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 40)
                        .background(RoundedRectangle(cornerRadius: 8).fill(WebTheme.primary))
                        
                        Button("Cancel") {
                            isEditing = false
                            password = ""
                        }
                        .font(displayFont(14, .semibold))
                        .foregroundColor(WebTheme.darkText)
                        .frame(maxWidth: .infinity)
                        .frame(height: 40)
                        .background(RoundedRectangle(cornerRadius: 8).fill(Color.gray.opacity(0.15)))
                    }
                }
                .frame(maxWidth: 360)
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 24)
        .padding(.bottom, 20)
    }
    
    private var statsSection: some View {
        HStack(spacing: 12) {
            ProfileStatCard(value: "42", label: "Items", suffix: nil)
            ProfileStatCard(value: "15", label: "Outfits", suffix: nil)
            ProfileStatCard(value: "98", label: "Style Score", suffix: "%")
        }
        .padding(.horizontal, 16)
        .padding(.bottom, 20)
    }
    
    private var premiumBanner: some View {
        ZStack(alignment: .topTrailing) {
            RoundedRectangle(cornerRadius: 12)
                .fill(LinearGradient(colors: [Color.black.opacity(0.88), Color.gray.opacity(0.9)], startPoint: .leading, endPoint: .trailing))
            Circle()
                .fill(WebTheme.primary.opacity(0.2))
                .frame(width: 120, height: 120)
                .blur(radius: 12)
                .offset(x: 26, y: -20)
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 6) {
                        Image(systemName: "diamond.fill")
                            .foregroundColor(.yellow)
                        Text("Go Premium")
                            .font(displayFont(16, .bold))
                            .foregroundColor(.white)
                    }
                    Text("Get unlimited AI outfit generations and advanced analytics.")
                        .font(displayFont(13, .regular))
                        .foregroundColor(.white.opacity(0.8))
                    Button("Upgrade Now") {}
                        .font(displayFont(12, .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(RoundedRectangle(cornerRadius: 8).fill(WebTheme.primary))
                }
                Spacer(minLength: 0)
                RemoteImage(urlString: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/assets/profile-premium-banner-placeholder.png")
                    .frame(width: 96, height: 96)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .padding(16)
        }
        .frame(height: 148)
        .padding(.horizontal, 16)
        .padding(.bottom, 24)
    }
    
    private var wardrobeSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("MY WARDROBE")
                .font(displayFont(12, .bold))
                .foregroundColor(Color.gray)
                .padding(.horizontal, 4)
            VStack(spacing: 0) {
                WardrobeRow(title: "Clothes", count: "28 items", icon: "tshirt", tint: WebTheme.primary)
                Divider().padding(.leading, 52)
                WardrobeRow(title: "Accessories", count: "14 items", icon: "sparkles", tint: .purple)
            }
            .liquidGlassCard(cornerRadius: 12, strokeOpacity: 0.32)
        }
        .padding(.horizontal, 16)
    }
    
    private func uploadAvatar(_ item: PhotosPickerItem) async {
        do {
            guard let data = try await item.loadTransferable(type: Data.self) else { return }
            let tempURL = FileManager.default.temporaryDirectory.appendingPathComponent("avatar-\(UUID().uuidString).jpg")
            try data.write(to: tempURL)
            await appState.uploadAvatar(imageURL: tempURL)
        } catch {
            appState.errorMessage = error.localizedDescription
        }
    }
}

private func profileInput(_ placeholder: String, text: Binding<String>, secure: Bool = false) -> some View {
    Group {
        if secure {
            SecureField(placeholder, text: text)
        } else {
            TextField(placeholder, text: text)
        }
    }
    .font(displayFont(14, .regular))
    .padding(.horizontal, 12)
    .frame(height: 40)
    .liquidGlassCard(cornerRadius: 8, strokeOpacity: 0.32)
}

private func profileReadOnlyInput(_ title: String, value: String) -> some View {
    VStack(alignment: .leading, spacing: 6) {
        Text(title)
            .font(displayFont(12, .medium))
            .foregroundColor(.gray)
        Text(value)
            .font(displayFont(14, .regular))
            .foregroundColor(Color.gray)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 12)
            .frame(height: 40)
            .liquidGlassCard(cornerRadius: 8, strokeOpacity: 0.28)
    }
}

struct ProfileStatCard: View {
    let value: String
    let label: String
    let suffix: String?
    
    var body: some View {
        VStack(spacing: 4) {
            HStack(spacing: 2) {
                Text(value)
                    .font(displayFont(20, .bold))
                    .foregroundColor(WebTheme.darkText)
                if let suffix {
                    Text(suffix)
                        .font(displayFont(14, .bold))
                        .foregroundColor(WebTheme.primary)
                }
            }
            Text(label.uppercased())
                .font(displayFont(11, .medium))
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 14)
        .liquidGlassCard(cornerRadius: 12, strokeOpacity: 0.32)
    }
}

struct WardrobeRow: View {
    let title: String
    let count: String
    let icon: String
    let tint: Color
    
    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(tint.opacity(0.12))
                .frame(width: 32, height: 32)
                .overlay(Image(systemName: icon).foregroundColor(tint))
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(displayFont(14, .semibold))
                    .foregroundColor(WebTheme.darkText)
                Text(count)
                    .font(displayFont(12, .regular))
                    .foregroundColor(.gray)
            }
            Spacer()
            Image(systemName: "chevron.right")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.gray.opacity(0.7))
        }
        .padding(16)
    }
}

// MARK: - Helpers

private extension Array {
    subscript(safe index: Int) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
