import Foundation
import SwiftUI

@MainActor
final class DressoAppState: ObservableObject {
    @Published var token: String? = nil
    @Published var user: User? = nil
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil
    
    let client = DressoClient()
    
    var isAuthenticated: Bool {
        token != nil
    }
    
    func signup(username: String, email: String, password: String) async {
        await authenticateFlow {
            try await client.signup(username: username, email: email, password: password)
        }
    }
    
    func login(email: String, password: String) async {
        await authenticateFlow {
            try await client.login(email: email, password: password)
        }
    }
    
    func loadCurrentUser() async {
        guard token != nil else { return }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        do {
            user = try await client.currentUser()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func logout() {
        token = nil
        user = nil
    }
    
    func fetchClothingItems() async -> [ClothingItem] {
        do {
            return try await client.clothingItems()
        } catch {
            errorMessage = error.localizedDescription
            return []
        }
    }
    
    // MARK: - Private
    
    private func authenticateFlow(_ action: () async throws -> Void) async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        do {
            try await action()
            // DressoClient stores the token internally; we just mark as authenticated.
            // Optionally, you could surface the token back out if needed.
            token = "set"
            user = try await client.currentUser()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

