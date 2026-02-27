import Foundation

struct Outfit: Identifiable, Hashable {
    struct Accessory: Identifiable, Hashable {
        let id: String
        let name: String
        let image: String
        let type: String
    }
    let id: String
    let title: String
    let images: [String]
    let tag: String
    let itemCount: Int
    let tagColor: String
    let matchPercentage: Int
    let description: String
    let isFavorite: Bool
    let accessories: [Accessory]
}

enum SampleData {
    static let outfits: [Outfit] = [
        Outfit(
            id: "1",
            title: "City Casual",
            images: [
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/outfits/city-casual-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/tops/blue-denim-jacket-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/tailored-trousers-placeholder.png"
            ],
            tag: "Streetwear",
            itemCount: 3,
            tagColor: "text-primary",
            matchPercentage: 98,
            description: "Perfect for city walks",
            isFavorite: false,
            accessories: [
                Outfit.Accessory(
                    id: "a1",
                    name: "Silver Watch",
                    image: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/accessories/silver-watch-placeholder.png",
                    type: "clothing"
                ),
                Outfit.Accessory(
                    id: "a2",
                    name: "Canvas Kicks",
                    image: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/shoes/canvas-kicks-placeholder.png",
                    type: "shopping"
                )
            ]
        ),
        Outfit(
            id: "2",
            title: "Summer Brunch",
            images: [
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/outfits/summer-brunch-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/tops/white-blouse-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/shoes/white-sneakers-placeholder.png"
            ],
            tag: "Warm",
            itemCount: 3,
            tagColor: "text-orange-500",
            matchPercentage: 95,
            description: "Fresh and airy look",
            isFavorite: true,
            accessories: [
                Outfit.Accessory(
                    id: "a3",
                    name: "Sunglasses",
                    image: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/accessories/sunglasses-placeholder.png",
                    type: "clothing"
                )
            ]
        ),
        Outfit(
            id: "3",
            title: "Smart Chic",
            images: [
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/outfits/smart-chic-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/tops/navy-hoodie-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/slim-jeans-placeholder.png"
            ],
            tag: "Work",
            itemCount: 3,
            tagColor: "text-purple-600",
            matchPercentage: 92,
            description: "Last worn 3d",
            isFavorite: false,
            accessories: [
                Outfit.Accessory(
                    id: "a4",
                    name: "Wool Scarf",
                    image: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/accessories/wool-scarf-placeholder.png",
                    type: "clothing"
                )
            ]
        ),
        Outfit(
            id: "4",
            title: "Weekend Vibes",
            images: [
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/outfits/weekend-vibes-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/tops/blue-denim-jacket-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/tailored-trousers-placeholder.png"
            ],
            tag: "Relaxed",
            itemCount: 3,
            tagColor: "text-teal-600",
            matchPercentage: 90,
            description: "AI Pick",
            isFavorite: false,
            accessories: [
                Outfit.Accessory(
                    id: "a5",
                    name: "Platform Sneakers",
                    image: "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/shoes/platform-sneakers-placeholder.png",
                    type: "shopping"
                )
            ]
        ),
        Outfit(
            id: "5",
            title: "Evening Date",
            images: [
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/outfits/evening-date-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/shoes/white-sneakers-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/slim-jeans-placeholder.png"
            ],
            tag: "Romantic",
            itemCount: 3,
            tagColor: "text-rose-500",
            matchPercentage: 97,
            description: "Fav",
            isFavorite: false,
            accessories: []
        ),
        Outfit(
            id: "6",
            title: "Coffee Run",
            images: [
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/outfits/coffee-run-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/tailored-trousers-placeholder.png",
                "https://dresso-1405307717.cos.ap-tokyo.myqcloud.com/images/clothing/bottoms/slim-jeans-placeholder.png"
            ],
            tag: "Comfy",
            itemCount: 3,
            tagColor: "text-slate-500",
            matchPercentage: 88,
            description: "New",
            isFavorite: false,
            accessories: []
        )
    ]
}
