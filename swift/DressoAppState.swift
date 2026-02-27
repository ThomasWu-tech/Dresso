import Foundation
import SwiftUI
import Combine

enum MainScreen: CaseIterable {
    case generator
    case closet
    case profile
}

@MainActor
final class DressoAppState: ObservableObject {
    @Published var token: String? = nil
    @Published var user: User? = nil
    @Published var isLoading: Bool = false
    @Published var errorMessage: String? = nil
    @Published var hasSeenOnboarding: Bool = false
    @Published var selectedMainScreen: MainScreen = .closet
    @Published var generatorItems: [ClothingItem] = []
    @Published var isGeneratorLoading: Bool = false
    @Published var generatorFilter: String = "All"
    @Published var selectedOutfit: Outfit? = SampleData.outfits.first
    @Published var isShowingOutfitDetail: Bool = false
    @Published var selectedGeneratorItemIDs: Set<String> = []
    @Published var favoriteOutfitIDs: Set<String> = []
    
    let client = DressoClient()
    
    var isAuthenticated: Bool {
        token != nil
    }
    
    func showSignupFlow() {
        hasSeenOnboarding = true
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
        selectedMainScreen = .closet
        selectedOutfit = nil
        isShowingOutfitDetail = false
        selectedGeneratorItemIDs.removeAll()
    }
    
    func refreshGeneratorItems() async {
        guard token != nil else { return }
        isGeneratorLoading = true
        defer { isGeneratorLoading = false }
        do {
            let items = try await client.clothingItems()
            generatorItems = items
            // Keep only selections that still exist after refresh.
            let validIDs = Set(items.map(\.id))
            selectedGeneratorItemIDs = selectedGeneratorItemIDs.intersection(validIDs)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func uploadClothing(fileURL: URL) async {
        guard token != nil else { return }
        isGeneratorLoading = true
        defer { isGeneratorLoading = false }
        do {
            _ = try await client.uploadClothing(imageFileURL: fileURL)
            await refreshGeneratorItems()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func updateProfile(username: String?, password: String?) async {
        guard token != nil else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            user = try await client.updateUser(username: username, password: password)
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func uploadAvatar(imageURL: URL) async {
        guard token != nil else { return }
        isLoading = true
        defer { isLoading = false }
        do {
            _ = try await client.uploadAvatar(imageFileURL: imageURL)
            user = try await client.currentUser()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
    
    func filteredGeneratorItems() -> [ClothingItem] {
        guard generatorFilter != "All" else { return generatorItems }
        return generatorItems.filter { $0.category.caseInsensitiveCompare(generatorFilter) == .orderedSame }
    }
    
    func isGeneratorItemSelected(_ id: String) -> Bool {
        selectedGeneratorItemIDs.contains(id)
    }
    
    func toggleGeneratorItemSelection(_ id: String) {
        if selectedGeneratorItemIDs.contains(id) {
            selectedGeneratorItemIDs.remove(id)
        } else {
            selectedGeneratorItemIDs.insert(id)
        }
    }
    
    var selectedGeneratorItemCount: Int {
        selectedGeneratorItemIDs.count
    }
    
    func isOutfitFavorite(_ outfit: Outfit) -> Bool {
        favoriteOutfitIDs.contains(outfit.id) || outfit.isFavorite
    }
    
    func toggleOutfitFavorite(_ outfit: Outfit) {
        if favoriteOutfitIDs.contains(outfit.id) {
            favoriteOutfitIDs.remove(outfit.id)
        } else {
            favoriteOutfitIDs.insert(outfit.id)
        }
    }
    
    // MARK: - Private
    
    private func authenticateFlow(_ action: () async throws -> Void) async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        
        do {
            try await action()
            token = "set"
            user = try await client.currentUser()
            isShowingOutfitDetail = false
            selectedGeneratorItemIDs.removeAll()
            await refreshGeneratorItems()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
