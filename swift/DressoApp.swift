import SwiftUI

@main
struct DressoApp: App {
    @StateObject private var appState = DressoAppState()
    
    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(appState)
        }
    }
}

