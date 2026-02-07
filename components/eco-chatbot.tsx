"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Leaf, Sparkles } from "lucide-react"

type Message = {
    id: string
    text: string
    sender: "user" | "bot"
    timestamp: Date
}

// Eco knowledge base with pattern matching
const ecoKnowledge = [
    {
        patterns: ["carbon footprint", "reduce carbon", "lower emissions", "co2"],
        response: "🌱 Great question! Here are ways to reduce your carbon footprint:\n\n• Use public transport or cycle instead of driving\n• Switch to LED bulbs (saves 75% energy)\n• Eat more plant-based meals\n• Reduce air travel when possible\n• Use renewable energy at home\n\nSmall changes add up! Start with one habit and build from there."
    },
    {
        patterns: ["recycle", "recycling", "waste segregation", "garbage sorting"],
        response: "♻️ Recycling Tips for India:\n\n• **Dry Waste**: Paper, plastic, metal, glass → Blue bin\n• **Wet Waste**: Food scraps, organic matter → Green bin\n• **E-Waste**: Electronics → Special collection centers\n• **Hazardous**: Batteries, medicines → Don't mix!\n\n📍 Check the Recycling Locator in our Services section for nearby centers!"
    },
    {
        patterns: ["plastic", "single use", "plastic free", "avoid plastic"],
        response: "🚫 Reducing Plastic Usage:\n\n• Carry a reusable water bottle (copper/steel)\n• Use cloth bags for shopping\n• Say no to plastic straws and cutlery\n• Buy products with minimal packaging\n• Choose glass/steel containers for food storage\n\n💡 India generates 3.5 million tonnes of plastic waste annually. Your choices matter!"
    },
    {
        patterns: ["compost", "composting", "kitchen waste", "organic waste"],
        response: "🍂 Home Composting Guide:\n\n1. Get a composting bin or designate a corner\n2. Add green waste (vegetable peels, fruit scraps)\n3. Layer with brown waste (dry leaves, cardboard)\n4. Keep it moist, not wet\n5. Turn weekly for aeration\n6. Ready in 2-3 months!\n\n🌿 Great for balcony gardens in Mumbai apartments!"
    },
    {
        patterns: ["solar", "solar panel", "renewable energy", "solar power"],
        response: "☀️ Solar Energy in India:\n\n• Rooftop solar can save 70-80% on electricity bills\n• Government subsidies available (up to 40%)\n• Net metering lets you sell excess power\n• Payback period: 4-6 years\n• Panel lifespan: 25+ years\n\n📞 Contact MSEDCL for Mumbai installations. Check our Learn section for a detailed course!"
    },
    {
        patterns: ["water", "save water", "water conservation", "rainwater"],
        response: "💧 Water Conservation Tips:\n\n• Fix leaky taps (saves 20L/day)\n• Use bucket instead of shower (saves 100L)\n• Rainwater harvesting (mandatory in Mumbai)\n• Reuse AC water for plants\n• Run washing machine with full loads only\n\n🌧️ Mumbai receives 2,500mm rainfall annually - harvest it!"
    },
    {
        patterns: ["air quality", "aqi", "pollution", "air pollution", "mask"],
        response: "🌫️ Air Quality & Health:\n\n• Check AQI before outdoor activities\n• Use N95 masks when AQI > 150\n• Indoor plants help purify air\n• Avoid outdoor exercise during high pollution\n• Keep windows closed during peak traffic hours\n\n📊 Mumbai's average AQI is moderate. Track it on the SAFAR app!"
    },
    {
        patterns: ["electric vehicle", "ev", "electric car", "electric bike"],
        response: "⚡ Electric Vehicles in India:\n\n• EVs save ₹70,000+ annually on fuel\n• FAME II subsidies available\n• Growing charging infrastructure in Mumbai\n• Lower maintenance costs\n• Zero tailpipe emissions\n\n🔌 Recommended: Check Tata, Ather, Ola for EVs. Mumbai has 500+ public charging points!"
    },
    {
        patterns: ["tree", "plant trees", "deforestation", "afforestation"],
        response: "🌳 Tree Planting Impact:\n\n• One tree absorbs 20kg CO₂/year\n• Trees reduce local temperature by 2-8°C\n• Native species: Neem, Peepal, Banyan, Mango\n• Best time to plant: Monsoon (June-Sept)\n\n🌲 Join our Community Events to participate in tree planting drives in Mumbai!"
    },
    {
        patterns: ["sustainable", "sustainability", "eco friendly", "green living"],
        response: "🌍 Sustainable Living Basics:\n\n• **Reduce**: Buy less, choose quality\n• **Reuse**: Repair before replacing\n• **Recycle**: Proper waste segregation\n• **Refuse**: Say no to unnecessary items\n• **Rot**: Compost organic waste\n\n✨ Track your progress in our Tracker section and earn eco-points!"
    },
    {
        patterns: ["food waste", "leftovers", "food sustainability"],
        response: "🍽️ Reducing Food Waste:\n\n• Plan meals before shopping\n• Store food properly (FIFO method)\n• Use leftovers creatively\n• Compost unavoidable waste\n• Share excess with neighbors\n\n📱 Apps like 'No Food Waste' connect you with NGOs to donate surplus food in Mumbai!"
    },
    {
        patterns: ["fashion", "clothing", "sustainable fashion", "fast fashion"],
        response: "👕 Sustainable Fashion Tips:\n\n• Buy less, choose well, make it last\n• Prefer natural fabrics (cotton, linen, khadi)\n• Shop second-hand or vintage\n• Repair and upcycle old clothes\n• Donate what you don't wear\n\n🇮🇳 Support Indian handloom and khadi - sustainable & supports artisans!"
    },
    {
        patterns: ["diet", "vegan", "vegetarian", "meat", "plant based"],
        response: "🥗 Sustainable Diet:\n\n• Plant-based meals have 50% lower emissions\n• India has rich vegetarian cuisine tradition\n• Local & seasonal produce is best\n• Reduce processed food consumption\n• Grow herbs on your balcony\n\n🌿 Even 2-3 meat-free days/week makes a big difference!"
    },
    {
        patterns: ["hello", "hi", "hey", "good morning", "good evening"],
        response: "👋 Hello! I'm EcoBot, your AI sustainability assistant!\n\n🌿 I can help you with:\n• Reducing carbon footprint\n• Recycling & waste management\n• Water & energy conservation\n• Sustainable living tips\n• **Waste classification** - Ask me what type of waste any item is!\n\nWhat would you like to know about? 💚"
    },
    {
        patterns: ["help", "what can you do", "features", "options"],
        response: "🤖 I'm here to help you live more sustainably!\n\n**Ask me about:**\n• ♻️ Recycling & composting\n• 💧 Water conservation\n• ⚡ Solar & renewable energy\n• 🚗 Electric vehicles\n• 🌳 Tree planting\n• 🌫️ Air quality\n• 👕 Sustainable fashion\n• 🍽️ Food waste\n• 🗑️ **Waste classification** (e.g., \"What waste is a coke can?\")\n\nJust type your question! 💬"
    },
    {
        patterns: ["thank", "thanks", "thx", "appreciate"],
        response: "😊 You're welcome! Happy to help you on your sustainability journey!\n\n🌍 Remember: Every small action counts. Together, we can make Mumbai and India greener!\n\nFeel free to ask more questions anytime! 💚"
    },
    {
        patterns: ["bye", "goodbye", "see you", "later"],
        response: "👋 Goodbye! Keep making eco-friendly choices!\n\n🌱 Quick reminder: Track your daily habits in the Tracker section to earn points and see your impact.\n\nSee you soon! 💚🌍"
    }
]

// Waste classification database
type WasteItem = {
    keywords: string[]
    type: "dry" | "wet" | "e-waste" | "hazardous" | "sanitary" | "medical"
    bin: string
    tips: string
    recyclable: boolean
}

const wasteDatabase: WasteItem[] = [
    // Dry Waste - Metals
    { keywords: ["coke can", "coca cola can", "pepsi can", "soda can", "aluminum can", "beer can", "tin can", "metal can"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Rinse before recycling. Aluminum is 100% recyclable!", recyclable: true },
    { keywords: ["steel", "iron", "metal scrap", "copper wire", "brass"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Sell to kabadiwala for best value!", recyclable: true },

    // Dry Waste - Plastics
    { keywords: ["plastic bottle", "water bottle", "pet bottle", "mineral water"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Remove cap & rinse. PET bottles are highly recyclable.", recyclable: true },
    { keywords: ["plastic bag", "polythene", "carry bag", "shopping bag"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Avoid single-use! But if you have them, clean & recycle.", recyclable: true },
    { keywords: ["plastic container", "food container", "tiffin", "dabba", "tupperware"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Clean thoroughly before recycling.", recyclable: true },
    { keywords: ["straw", "plastic straw"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Switch to steel/bamboo straws instead!", recyclable: false },
    { keywords: ["bottle cap", "plastic cap", "lid"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Collect separately - many NGOs collect caps!", recyclable: true },
    { keywords: ["chips packet", "wrapper", "candy wrapper", "biscuit packet", "namkeen packet"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Multi-layer plastics are hard to recycle. Avoid when possible.", recyclable: false },
    { keywords: ["thermocol", "styrofoam", "foam"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Not easily recyclable. Avoid thermocol packaging!", recyclable: false },

    // Dry Waste - Paper
    { keywords: ["newspaper", "paper", "magazine", "book", "notebook", "cardboard", "carton"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Keep dry! Wet paper can't be recycled.", recyclable: true },
    { keywords: ["tissue", "tissue paper", "paper napkin", "paper towel"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Used tissues go to wet waste if soiled with food.", recyclable: false },
    { keywords: ["tetra pack", "tetrapack", "juice box", "milk carton"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Rinse & flatten. Special recycling process needed.", recyclable: true },

    // Dry Waste - Glass
    { keywords: ["glass bottle", "glass jar", "broken glass", "glass", "mirror"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Wrap broken glass carefully. 100% recyclable!", recyclable: true },
    { keywords: ["light bulb", "bulb", "tube light", "cfl"], type: "hazardous", bin: "⚠️ Hazardous Waste", tips: "Contains mercury! Take to e-waste center.", recyclable: false },

    // Dry Waste - Others
    { keywords: ["clothes", "old clothes", "fabric", "textile", "kapda"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Donate wearable clothes! Torn ones can be recycled.", recyclable: true },
    { keywords: ["shoes", "chappal", "sandal", "footwear"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Donate if usable. Some brands have take-back programs.", recyclable: false },
    { keywords: ["rubber", "tyre", "tire"], type: "dry", bin: "🔵 Blue Bin (Dry Waste)", tips: "Tyres need special recycling. Contact kabadiwala.", recyclable: true },

    // Wet Waste - Food
    { keywords: ["vegetable", "sabzi", "veggie peel", "vegetable peel", "vegetable waste"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Perfect for composting! Start a home compost.", recyclable: false },
    { keywords: ["fruit", "fruit peel", "banana peel", "orange peel", "apple core"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Compostable! Great for garden soil.", recyclable: false },
    { keywords: ["leftover food", "food waste", "roti", "rice", "dal", "sabzi", "cooked food"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Avoid wasting food. Compost what remains.", recyclable: false },
    { keywords: ["egg shell", "eggshell", "anda"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Crush & add to compost. Great calcium source for plants!", recyclable: false },
    { keywords: ["tea leaves", "chai patti", "coffee grounds"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Excellent for compost! Plants love it.", recyclable: false },
    { keywords: ["meat", "fish", "chicken", "mutton", "bones"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Keep separate. Can attract pests in home compost.", recyclable: false },
    { keywords: ["dairy", "milk", "curd", "paneer", "cheese"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Small amounts only in compost to avoid smell.", recyclable: false },

    // Wet Waste - Garden
    { keywords: ["leaves", "dry leaves", "garden waste", "grass", "flowers", "plant"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Perfect brown material for composting!", recyclable: false },
    { keywords: ["coconut shell", "nariyal"], type: "wet", bin: "🟢 Green Bin (Wet Waste)", tips: "Takes time to decompose. Break into pieces.", recyclable: false },

    // E-Waste
    { keywords: ["phone", "mobile", "smartphone", "iphone", "android", "cellphone"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "Contains valuable metals! Take to authorized e-waste center.", recyclable: true },
    { keywords: ["laptop", "computer", "pc", "desktop", "monitor", "keyboard", "mouse"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "E-waste has gold, copper! Recycle properly for resources.", recyclable: true },
    { keywords: ["charger", "cable", "wire", "usb", "adapter", "power bank"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "Don't throw in regular trash. E-waste center only!", recyclable: true },
    { keywords: ["headphone", "earphone", "airpods", "speaker", "bluetooth"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "Contains lithium batteries. Proper disposal needed.", recyclable: true },
    { keywords: ["tv", "television", "remote", "set top box", "dvd player"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "Large e-waste. Many brands offer take-back.", recyclable: true },
    { keywords: ["refrigerator", "fridge", "ac", "air conditioner", "washing machine", "microwave"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "Contains refrigerants. Professional disposal needed.", recyclable: true },
    { keywords: ["printer", "scanner", "cartridge", "ink cartridge", "toner"], type: "e-waste", bin: "📱 E-Waste Collection", tips: "Ink cartridges can often be refilled!", recyclable: true },

    // Hazardous Waste
    { keywords: ["battery", "cell", "dry cell", "aa battery", "aaa battery"], type: "hazardous", bin: "⚠️ Hazardous Waste", tips: "Contains toxic chemicals! Never burn. Special disposal.", recyclable: false },
    { keywords: ["paint", "paint can", "thinner", "varnish", "polish"], type: "hazardous", bin: "⚠️ Hazardous Waste", tips: "Chemical waste. Don't pour down drain!", recyclable: false },
    { keywords: ["pesticide", "insecticide", "mosquito repellent", "hit", "all out"], type: "hazardous", bin: "⚠️ Hazardous Waste", tips: "Toxic chemicals. Keep separate from regular waste.", recyclable: false },
    { keywords: ["nail polish", "nail polish remover", "acetone"], type: "hazardous", bin: "⚠️ Hazardous Waste", tips: "Chemical waste requiring special disposal.", recyclable: false },
    { keywords: ["aerosol", "spray can", "deodorant can", "room freshener"], type: "hazardous", bin: "⚠️ Hazardous Waste", tips: "Pressurized & may contain chemicals. Handle carefully.", recyclable: false },

    // Sanitary Waste
    { keywords: ["diaper", "nappy", "pampers"], type: "sanitary", bin: "🔴 Sanitary Waste", tips: "Wrap properly. Goes to landfill unfortunately.", recyclable: false },
    { keywords: ["sanitary pad", "sanitary napkin", "tampon", "menstrual"], type: "sanitary", bin: "🔴 Sanitary Waste", tips: "Wrap in newspaper & dispose separately. Consider menstrual cups!", recyclable: false },
    { keywords: ["cotton", "bandage", "band aid", "plaster"], type: "sanitary", bin: "🔴 Sanitary Waste", tips: "Used medical items go to sanitary waste.", recyclable: false },

    // Medical Waste
    { keywords: ["medicine", "tablet", "capsule", "syrup", "expired medicine", "dawa"], type: "medical", bin: "💊 Medical Waste", tips: "Return expired medicines to pharmacy. Don't flush!", recyclable: false },
    { keywords: ["syringe", "needle", "injection"], type: "medical", bin: "💊 Medical Waste", tips: "Sharps need special disposal. Use hospitals' bins.", recyclable: false },
]

// Enhanced response function with waste classification
const getResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    // Check for waste classification questions
    const wasteQuestionPatterns = [
        /what (?:type of |kind of )?waste is (?:a |an )?(.+)/i,
        /(?:which|what) bin (?:for|does) (?:a |an )?(.+)/i,
        /how (?:to|do i) (?:dispose|recycle|throw) (?:a |an )?(.+)/i,
        /where (?:to|do i) (?:put|throw|dispose) (?:a |an )?(.+)/i,
        /is (?:a |an )?(.+?) (?:recyclable|dry waste|wet waste)/i,
        /(.+?) (?:kaun|konsa|kis) waste/i,
        /(.+?) (?:kidhar|kaha) (?:daalu|throw|feko)/i,
    ]

    for (const pattern of wasteQuestionPatterns) {
        const match = lowerInput.match(pattern)
        if (match) {
            const itemQuery = match[1].trim().replace(/[?.,!]/g, '')

            // Search in waste database
            for (const item of wasteDatabase) {
                if (item.keywords.some(keyword =>
                    itemQuery.includes(keyword) || keyword.includes(itemQuery)
                )) {
                    const typeEmoji = {
                        "dry": "📦",
                        "wet": "🥬",
                        "e-waste": "📱",
                        "hazardous": "⚠️",
                        "sanitary": "🔴",
                        "medical": "💊"
                    }[item.type]

                    const typeName = {
                        "dry": "Dry Waste",
                        "wet": "Wet Waste (Organic)",
                        "e-waste": "E-Waste (Electronic)",
                        "hazardous": "Hazardous Waste",
                        "sanitary": "Sanitary Waste",
                        "medical": "Medical/Biomedical Waste"
                    }[item.type]

                    return `${typeEmoji} **${itemQuery.toUpperCase()}** is **${typeName}**!\n\n🗑️ **Dispose in:** ${item.bin}\n\n${item.recyclable ? "♻️ **Recyclable:** Yes" : "❌ **Recyclable:** No"}\n\n💡 **Tip:** ${item.tips}\n\n📍 For recycling centers near you, check our Services → Recycling Locator!`
                }
            }

            // Item not found in database
            return `🤔 I don't have specific info about "${itemQuery}" yet.\n\n**General guidelines:**\n• If it's **food/organic** → 🟢 Wet Waste\n• If it's **plastic/paper/metal/glass** → 🔵 Dry Waste\n• If it's **electronic** → 📱 E-Waste\n• If it's **chemical/toxic** → ⚠️ Hazardous\n\n💡 When in doubt, check the product label or ask your local waste collector!`
        }
    }

    // Check for general item mentions (without question pattern)
    for (const item of wasteDatabase) {
        if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
            const typeEmoji = {
                "dry": "📦",
                "wet": "🥬",
                "e-waste": "📱",
                "hazardous": "⚠️",
                "sanitary": "🔴",
                "medical": "💊"
            }[item.type]

            return `${typeEmoji} That's **${item.type === "e-waste" ? "E-Waste" : item.type.charAt(0).toUpperCase() + item.type.slice(1) + " Waste"}**!\n\n🗑️ **Dispose in:** ${item.bin}\n\n💡 **Tip:** ${item.tips}`
        }
    }

    // Find matching pattern from knowledge base
    for (const knowledge of ecoKnowledge) {
        if (knowledge.patterns.some(pattern => lowerInput.includes(pattern))) {
            return knowledge.response
        }
    }

    // Default response
    return "🤔 I'm not sure about that specific topic, but I'm learning!\n\n💡 Try asking about:\n• Carbon footprint\n• Recycling\n• Water conservation\n• Solar energy\n• Air quality\n• Sustainable living\n• **Waste classification** (e.g., \"What waste is a coke can?\")\n\nOr check our Learn section for detailed articles and courses! 📚"
}

export function EcoChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "👋 Hi! I'm EcoBot, your AI sustainability assistant!\n\n🌿 Ask me anything about:\n• Recycling & waste management\n• Carbon footprint reduction\n• Water & energy conservation\n• Sustainable living in Mumbai\n\nHow can I help you today? 💚",
            sender: "bot",
            timestamp: new Date()
        }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: crypto.randomUUID(),
            text: input,
            sender: "user",
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        // Simulate typing delay for natural feel
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))

        const botResponse: Message = {
            id: crypto.randomUUID(),
            text: getResponse(input),
            sender: "bot",
            timestamp: new Date()
        }

        setIsTyping(false)
        setMessages(prev => [...prev, botResponse])
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const quickQuestions = [
        "How to reduce carbon footprint?",
        "Recycling tips",
        "Save water at home",
        "What is composting?"
    ]

    return (
        <>
            {/* Floating Chat Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg z-50 transition-all duration-300 ${isOpen ? "scale-0" : "scale-100"}`}
                size="icon"
            >
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Open EcoBot</span>
                {/* Pulse animation */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full animate-pulse flex items-center justify-center">
                    <Sparkles className="h-2.5 w-2.5 text-yellow-800" />
                </span>
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-green-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex-shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">EcoBot</h3>
                                    <p className="text-xs text-green-100 flex items-center gap-1">
                                        <span className="h-2 w-2 bg-green-300 rounded-full animate-pulse" />
                                        AI Eco-Assistant
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20 h-8 w-8"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages - Native Scroll */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4"
                        style={{ minHeight: 0 }}
                    >
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {message.sender === "bot" && (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <Leaf className="h-4 w-4 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${message.sender === "user"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md"
                                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                </div>
                                {message.sender === "user" && (
                                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <Leaf className="h-4 w-4 text-white" />
                                </div>
                                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Questions */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex-shrink-0 border-t border-gray-100 pt-2">
                            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(q)
                                            setTimeout(() => handleSend(), 100)
                                        }}
                                        className="text-xs bg-green-50 text-green-700 px-2.5 py-1.5 rounded-full hover:bg-green-100 transition-colors border border-green-200"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input - Always visible at bottom */}
                    <div className="p-3 border-t bg-white flex-shrink-0">
                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask about sustainability..."
                                className="flex-1 rounded-full border-green-200 focus:border-green-400 focus:ring-green-400 text-sm"
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isTyping}
                                className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-10 w-10 flex-shrink-0"
                                size="icon"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

