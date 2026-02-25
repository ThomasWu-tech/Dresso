import SwiftUI

enum AuthScreen {
    case login
    case signup
}

struct RootView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var authScreen: AuthScreen = .login
    
    var body: some View {
        Group {
            if appState.isAuthenticated {
                ClosetView()
            } else {
                switch authScreen {
                case .login:
                    LoginView(onSignupTapped: { authScreen = .signup })
                case .signup:
                    SignupView(onLoginTapped: { authScreen = .login })
                }
            }
        }
        .alert("Error", isPresented: .constant(appState.errorMessage != nil), actions: {
            Button("OK") { appState.errorMessage = nil }
        }, message: {
            Text(appState.errorMessage ?? "")
        })
    }
}

struct LoginView: View {
    @EnvironmentObject var appState: DressoAppState
    
    @State private var email: String = ""
    @State private var password: String = ""
    
    let onSignupTapped: () -> Void
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(.systemGray6), Color(.systemBackground)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack {
                Spacer(minLength: 40)
                
                VStack(spacing: 12) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .fill(Color.blue)
                            .frame(width: 80, height: 80)
                            .shadow(color: Color.blue.opacity(0.3), radius: 20, x: 0, y: 10)
                        Image(systemName: "hanger")
                            .foregroundColor(.white)
                            .font(.system(size: 34, weight: .bold))
                    }
                    
                    Text("Sign In")
                        .font(.system(size: 30, weight: .bold))
                        .foregroundColor(.primary)
                    
                    Text("Welcome back to Dresso")
                        .font(.system(size: 17))
                        .foregroundColor(Color(.systemGray))
                }
                .padding(.bottom, 32)
                
                VStack(spacing: 16) {
                    GroupBox {
                        VStack(spacing: 0) {
                            TextField("Email", text: $email)
                                .keyboardType(.emailAddress)
                                .textContentType(.emailAddress)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .padding(.vertical, 12)
                            
                            Divider()
                            
                            SecureField("Password", text: $password)
                                .textContentType(.password)
                                .padding(.vertical, 12)
                        }
                    }
                    
                    Button {
                        Task {
                            await appState.login(email: email, password: password)
                        }
                    } label: {
                        ZStack {
                            RoundedRectangle(cornerRadius: 18, style: .continuous)
                                .fill(Color.blue)
                                .frame(height: 54)
                                .shadow(color: Color.blue.opacity(0.3), radius: 16, x: 0, y: 8)
                            
                            if appState.isLoading {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text("Sign In")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .disabled(appState.isLoading)
                    
                    Button(action: onSignupTapped) {
                        Text("Create New Account")
                            .font(.system(size: 17, weight: .medium))
                            .foregroundColor(.blue)
                            .frame(maxWidth: .infinity)
                            .padding(.top, 4)
                    }
                }
                .padding(.horizontal, 24)
                
                Spacer()
            }
        }
    }
}

struct SignupView: View {
    @EnvironmentObject var appState: DressoAppState
    
    @State private var username: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    
    let onLoginTapped: () -> Void
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(.systemGray6), Color(.systemBackground)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack {
                Spacer(minLength: 40)
                
                VStack(spacing: 12) {
                    ZStack {
                        RoundedRectangle(cornerRadius: 22, style: .continuous)
                            .fill(Color.blue)
                            .frame(width: 80, height: 80)
                            .shadow(color: Color.blue.opacity(0.3), radius: 20, x: 0, y: 10)
                        Image(systemName: "person.badge.plus")
                            .foregroundColor(.white)
                            .font(.system(size: 34, weight: .bold))
                    }
                    
                    Text("Create Account")
                        .font(.system(size: 30, weight: .bold))
                        .foregroundColor(.primary)
                    
                    Text("Join the Dresso community")
                        .font(.system(size: 17))
                        .foregroundColor(Color(.systemGray))
                }
                .padding(.bottom, 32)
                
                VStack(spacing: 16) {
                    GroupBox {
                        VStack(spacing: 0) {
                            TextField("Username", text: $username)
                                .textContentType(.username)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .padding(.vertical, 10)
                            
                            Divider()
                            
                            TextField("Email", text: $email)
                                .keyboardType(.emailAddress)
                                .textContentType(.emailAddress)
                                .autocapitalization(.none)
                                .disableAutocorrection(true)
                                .padding(.vertical, 10)
                            
                            Divider()
                            
                            SecureField("Password", text: $password)
                                .textContentType(.newPassword)
                                .padding(.vertical, 10)
                        }
                    }
                    
                    Button {
                        Task {
                            await appState.signup(username: username, email: email, password: password)
                        }
                    } label: {
                        ZStack {
                            RoundedRectangle(cornerRadius: 18, style: .continuous)
                                .fill(Color.blue)
                                .frame(height: 54)
                                .shadow(color: Color.blue.opacity(0.3), radius: 16, x: 0, y: 8)
                            
                            if appState.isLoading {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text("Sign Up")
                                    .font(.system(size: 18, weight: .semibold))
                                    .foregroundColor(.white)
                            }
                        }
                    }
                    .disabled(appState.isLoading)
                    
                    Button(action: onLoginTapped) {
                        Text("Already have an account? Sign In")
                            .font(.system(size: 17, weight: .medium))
                            .foregroundColor(.blue)
                            .frame(maxWidth: .infinity)
                            .padding(.top, 4)
                    }
                }
                .padding(.horizontal, 24)
                
                Spacer()
            }
        }
    }
}

struct ClosetView: View {
    @EnvironmentObject var appState: DressoAppState
    @State private var outfits: [ClothingItem] = []
    @State private var searchText: String = ""
    
    var filteredOutfits: [ClothingItem] {
        guard !searchText.isEmpty else { return outfits }
        return outfits.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(.systemGroupedBackground)
                    .ignoresSafeArea()
                
                VStack(spacing: 0) {
                    header
                    searchBar
                    listContent
                }
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Logout") {
                        appState.logout()
                    }
                }
            }
            .task {
                outfits = await appState.fetchClothingItems()
                await appState.loadCurrentUser()
            }
        }
    }
    
    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Closet")
                        .font(.system(size: 32, weight: .heavy))
                    Text("\(outfits.count) items")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(.systemGray))
                }
                Spacer()
                Image(systemName: "plus.circle.fill")
                    .font(.system(size: 24, weight: .semibold))
                    .foregroundColor(.blue)
            }
        }
        .padding(.horizontal, 20)
        .padding(.top, 16)
    }
    
    private var searchBar: some View {
        HStack {
            Image(systemName: "magnifyingglass")
                .foregroundColor(Color(.systemGray))
            TextField("Search outfits...", text: $searchText)
                .textFieldStyle(.plain)
        }
        .padding(10)
        .background(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(Color(.secondarySystemBackground))
        )
        .padding(.horizontal, 20)
        .padding(.top, 12)
    }
    
    private var listContent: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                if filteredOutfits.isEmpty {
                    VStack(spacing: 16) {
                        ZStack {
                            Circle()
                                .fill(Color(.secondarySystemBackground))
                                .frame(width: 80, height: 80)
                            Image(systemName: "sparkles")
                                .font(.system(size: 34))
                                .foregroundColor(Color(.systemGray))
                        }
                        Text("No outfits yet")
                            .font(.system(size: 20, weight: .bold))
                        Text("Use the web generator to create your first AI-designed look, then refresh.")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(Color(.systemGray))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 32)
                    }
                    .padding(.top, 60)
                } else {
                    ForEach(filteredOutfits, id: \.id) { item in
                        ClothingCard(item: item)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                }
            }
            .padding(.bottom, 30)
        }
    }
}

struct ClothingCard: View {
    let item: ClothingItem
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: 24, style: .continuous)
                    .fill(Color(.systemBackground))
                    .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 6)
                
                VStack(alignment: .leading, spacing: 10) {
                    if let url = URL(string: item.image) {
                        AsyncImage(url: url) { phase in
                            switch phase {
                            case .empty:
                                ZStack {
                                    Color(.secondarySystemBackground)
                                    ProgressView()
                                }
                            case .success(let image):
                                image
                                    .resizable()
                                    .scaledToFill()
                            case .failure:
                                ZStack {
                                    Color(.secondarySystemBackground)
                                    Image(systemName: "photo")
                                        .foregroundColor(Color(.systemGray))
                                }
                            @unknown default:
                                EmptyView()
                            }
                        }
                        .frame(height: 180)
                        .clipped()
                        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                    }
                    
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(item.name)
                                .font(.system(size: 18, weight: .bold))
                            Text(item.category)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.blue)
                        }
                        Spacer()
                    }
                    .padding(.horizontal, 12)
                    .padding(.bottom, 12)
                }
                .padding(8)
            }
        }
    }
}

