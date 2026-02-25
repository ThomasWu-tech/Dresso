import Foundation

// MARK: - Configuration

/// Base URL for the running Dresso backend.
/// Change this if your server is not on localhost:8000.
public let dressoBaseURL = URL(string: "http://localhost:8000")!

// MARK: - Models

public struct AuthResponse: Decodable {
    public let access_token: String
    public let token_type: String
}

public struct User: Decodable {
    public let id: Int
    public let username: String?
    public let email: String?
    public let avatar_url: String?
}

public struct ClothingItem: Decodable {
    public let id: String
    public let name: String
    public let image: String
    public let category: String
    public let isSelected: Bool
}

public enum DressoClientError: Error {
    case invalidURL
    case invalidResponse
    case httpError(status: Int, detail: String?)
    case decodingError(Error)
    case other(Error)
}

extension DressoClientError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "The backend URL is invalid."
        case .invalidResponse:
            return "Received an invalid response from the server."
        case .httpError(let status, let detail):
            if let detail, !detail.isEmpty {
                return detail
            }
            return "Request failed with HTTP status code \(status)."
        case .decodingError(let error):
            return "Failed to decode server response: \(error.localizedDescription)"
        case .other(let error):
            return error.localizedDescription
        }
    }
}

// MARK: - Client

public final class DressoClient {
    private let baseURL: URL
    private let session: URLSession
    private var accessToken: String?
    
    public init(baseURL: URL = dressoBaseURL) {
        self.baseURL = baseURL
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 60
        self.session = URLSession(configuration: config)
    }
    
    // MARK: - Public API
    
    public func signup(username: String, email: String, password: String) async throws {
        let payload: [String: Any] = [
            "username": username,
            "email": email,
            "password": password
        ]
        let auth: AuthResponse = try await postJSON(path: "/signup", jsonBody: payload)
        self.accessToken = auth.access_token
    }
    
    public func login(email: String, password: String) async throws {
        let payload: [String: Any] = [
            "username": email,
            "password": password
        ]
        let auth: AuthResponse = try await postJSON(path: "/token", jsonBody: payload)
        self.accessToken = auth.access_token
    }
    
    public func currentUser() async throws -> User {
        try await getJSON(path: "/users/me")
    }
    
    public func updateUser(username: String? = nil, password: String? = nil) async throws -> User {
        var payload: [String: Any] = [:]
        if let username { payload["username"] = username }
        if let password { payload["password"] = password }
        return try await putJSON(path: "/users/me", jsonBody: payload)
    }
    
    public func clothingItems() async throws -> [ClothingItem] {
        try await getJSON(path: "/clothing-items")
    }
    
    public func uploadAvatar(imageFileURL: URL) async throws -> String {
        let result: [String: String] = try await uploadMultipart(
            path: "/users/me/avatar",
            fileFieldName: "file",
            fileURL: imageFileURL
        )
        return result["avatar_url"] ?? ""
    }
    
    public func uploadClothing(imageFileURL: URL) async throws -> (category: String, path: String, name: String) {
        struct UploadResponse: Decodable {
            let category: String
            let path: String
            let name: String
        }
        
        let data: UploadResponse = try await uploadMultipartDecodable(
            path: "/upload-clothing",
            fileFieldName: "file",
            fileURL: imageFileURL
        )
        return (data.category, data.path, data.name)
    }
    
    // MARK: - Internal networking helpers
    
    private func makeRequest(path: String, method: String, jsonBody: [String: Any]? = nil) throws -> URLRequest {
        guard let url = URL(string: path, relativeTo: baseURL) else {
            throw DressoClientError.invalidURL
        }
        var request = URLRequest(url: url)
        request.httpMethod = method
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let jsonBody {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONSerialization.data(withJSONObject: jsonBody, options: [])
        }
        return request
    }
    
    private func handleResponse<T: Decodable>(_ data: Data, _ response: URLResponse, as type: T.Type) throws -> T {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw DressoClientError.invalidResponse
        }
        
        guard (200..<300).contains(httpResponse.statusCode) else {
            let detail = (try? JSONSerialization.jsonObject(with: data, options: []))
                .flatMap { $0 as? [String: Any] }?["detail"] as? String
            throw DressoClientError.httpError(status: httpResponse.statusCode, detail: detail)
        }
        
        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw DressoClientError.decodingError(error)
        }
    }
    
    private func data(for request: URLRequest) async throws -> (Data, URLResponse) {
        do {
            return try await session.data(for: request)
        } catch {
            throw DressoClientError.other(error)
        }
    }
    
    // MARK: - JSON convenience
    
    private func getJSON<T: Decodable>(path: String) async throws -> T {
        let request = try makeRequest(path: path, method: "GET")
        let (data, response) = try await data(for: request)
        return try handleResponse(data, response, as: T.self)
    }
    
    private func postJSON<T: Decodable>(path: String, jsonBody: [String: Any]) async throws -> T {
        let request = try makeRequest(path: path, method: "POST", jsonBody: jsonBody)
        let (data, response) = try await data(for: request)
        return try handleResponse(data, response, as: T.self)
    }
    
    private func putJSON<T: Decodable>(path: String, jsonBody: [String: Any]) async throws -> T {
        let request = try makeRequest(path: path, method: "PUT", jsonBody: jsonBody)
        let (data, response) = try await data(for: request)
        return try handleResponse(data, response, as: T.self)
    }
    
    // MARK: - Multipart helpers
    
    private func uploadMultipart(
        path: String,
        fileFieldName: String,
        fileURL: URL
    ) async throws -> [String: String] {
        let (data, response) = try await multipartRequest(
            path: path,
            fileFieldName: fileFieldName,
            fileURL: fileURL
        )
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw DressoClientError.invalidResponse
        }
        
        guard (200..<300).contains(httpResponse.statusCode) else {
            let detail = (try? JSONSerialization.jsonObject(with: data, options: []))
                .flatMap { $0 as? [String: Any] }?["detail"] as? String
            throw DressoClientError.httpError(status: httpResponse.statusCode, detail: detail)
        }
        
        let json = (try? JSONSerialization.jsonObject(with: data, options: [])) as? [String: Any]
        var result: [String: String] = [:]
        json?.forEach { key, value in
            if let stringValue = value as? String {
                result[key] = stringValue
            }
        }
        return result
    }
    
    private func uploadMultipartDecodable<T: Decodable>(
        path: String,
        fileFieldName: String,
        fileURL: URL
    ) async throws -> T {
        let (data, response) = try await multipartRequest(
            path: path,
            fileFieldName: fileFieldName,
            fileURL: fileURL
        )
        return try handleResponse(data, response, as: T.self)
    }
    
    private func multipartRequest(
        path: String,
        fileFieldName: String,
        fileURL: URL
    ) async throws -> (Data, URLResponse) {
        guard let url = URL(string: path, relativeTo: baseURL) else {
            throw DressoClientError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        let filename = fileURL.lastPathComponent
        let mimeType = "image/jpeg"
        let fileData = try Data(contentsOf: fileURL)
        
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"\(fileFieldName)\"; filename=\"\(filename)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: \(mimeType)\r\n\r\n".data(using: .utf8)!)
        body.append(fileData)
        body.append("\r\n".data(using: .utf8)!)
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        return try await data(for: request)
    }
}

