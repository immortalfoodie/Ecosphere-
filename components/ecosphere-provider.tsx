"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type UserProfile = {
  id: string
  name: string
  location: string
  level: number
  points: number
  rank: number
  totalUsers: number
  joinDate: string
  eventsJoined: number
  productsScanned: number
  carbonSavedKg: number
  treesPlanted: number
  currentStreak: number
  longestStreak: number
}

type EventItem = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  distance: string
  attendees: number
  maxAttendees: number
  category: string
  organizer: string
  points: number
  image: string
  tags: string[]
}

type ScannerProduct = {
  id: string
  name: string
  brand: string
  barcode: string
  ecoScore: number
  carbonFootprint: string
  waterUsage: string
  recyclable: boolean
  certifications: string[]
  description: string
  alternatives: string[]
}

type StoreProduct = {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  category: string
  ecoScore: number
  certifications: string[]
  image: string
  inStock: boolean
  pointsReward: number
  ngoSupport: string
}

type CartItem = {
  productId: string
  quantity: number
}

type Order = {
  id: string
  items: CartItem[]
  total: number
  placedAt: string
}

type ScanHistoryItem = {
  id: string
  productId: string
  scannedAt: string
}

type TrackerSnapshot = {
  id: string
  date: string
  carbonData: {
    electricity: number
    transport: number
    food: number
    waste: number
  }
  wasteData: {
    plastic: number
    organic: number
    paper: number
    electronic: number
  }
  transportData: {
    walking: number
    cycling: number
    publicTransport: number
    car: number
  }
}

type CourseProgress = {
  id: string
  progress: number
}

type EcosphereState = {
  user: UserProfile
  events: EventItem[]
  eventRsvps: string[]
  scannerProducts: ScannerProduct[]
  scanHistory: ScanHistoryItem[]
  storeProducts: StoreProduct[]
  cart: CartItem[]
  orders: Order[]
  trackerSnapshots: TrackerSnapshot[]
  courseProgress: CourseProgress[]
}

type EcosphereContextValue = {
  state: EcosphereState
  rsvpEvent: (eventId: string) => void
  cancelRsvp: (eventId: string) => void
  recordScan: (productId: string) => void
  addToCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  checkoutCart: () => void
  saveTrackerSnapshot: (snapshot: Omit<TrackerSnapshot, "id" | "date">) => void
  updateCourseProgress: (courseId: string, progress: number) => void
}

const STORAGE_KEY_PREFIX = "ecosphere-state-v1"
const AUTH_STORAGE_KEY = "ecosphere-auth"

// Get current logged in user email for storage key
const getStorageKey = (): string => {
  if (typeof window === "undefined") return STORAGE_KEY_PREFIX
  const authData = localStorage.getItem(AUTH_STORAGE_KEY)
  if (authData) {
    try {
      const user = JSON.parse(authData)
      if (user?.email) {
        return `${STORAGE_KEY_PREFIX}-${user.email}`
      }
    } catch {
      // ignore
    }
  }
  return STORAGE_KEY_PREFIX // fallback for guests
}

const seedState: EcosphereState = {
  user: {
    id: "user-1",
    name: "Arjun Sharma",
    location: "Mumbai, India",
    level: 12,
    points: 2450,
    rank: 47,
    totalUsers: 8500,
    joinDate: "March 2024",
    eventsJoined: 23,
    productsScanned: 156,
    carbonSavedKg: 2400,
    treesPlanted: 8,
    currentStreak: 15,
    longestStreak: 28,
  },
  events: [
    {
      id: "1",
      title: "Community Beach Cleanup",
      description: "Join us for a morning of cleaning up our local beach and protecting marine life.",
      date: "2025-01-15",
      time: "09:00 AM",
      location: "Versova, Mumbai",
      distance: "2.3 km away",
      attendees: 45,
      maxAttendees: 60,
      category: "cleanup",
      organizer: "Ocean Guardians NGO",
      points: 50,
      image: "/beach-cleanup-volunteers.png",
      tags: ["Beach", "Marine Life", "Community"],
    },
    {
      id: "2",
      title: "Urban Tree Planting Drive",
      description: "Help us plant 100 native trees in downtown parks to improve air quality.",
      date: "2025-01-18",
      time: "08:00 AM",
      location: "Bandra, Mumbai",
      distance: "5.1 km away",
      attendees: 32,
      maxAttendees: 50,
      category: "planting",
      organizer: "Green City Initiative",
      points: 75,
      image: "/tree-planting-volunteers.png",
      tags: ["Trees", "Air Quality", "Urban"],
    },
    {
      id: "3",
      title: "Sustainable Living Workshop",
      description: "Learn practical tips for reducing waste and living more sustainably at home.",
      date: "2025-01-20",
      time: "02:00 PM",
      location: "Borivali, Mumbai",
      distance: "1.8 km away",
      attendees: 28,
      maxAttendees: 40,
      category: "workshop",
      organizer: "EcoLife Education",
      points: 30,
      image: "/sustainability-workshop.png",
      tags: ["Education", "Zero Waste", "Lifestyle"],
    },
    {
      id: "4",
      title: "River Restoration Project",
      description: "Help restore native vegetation along the riverbank and remove invasive species.",
      date: "2025-01-22",
      time: "10:00 AM",
      location: "Mithi River, Borivali, Mumbai",
      distance: "7.2 km away",
      attendees: 18,
      maxAttendees: 25,
      category: "restoration",
      organizer: "River Keepers Alliance",
      points: 100,
      image: "/river-restoration-volunteers.png",
      tags: ["Water", "Habitat", "Conservation"],
    },
  ],
  eventRsvps: [],
  scannerProducts: [
    {
      id: "1",
      name: "Organic Cotton T-Shirt",
      brand: "EcoWear",
      barcode: "5901234123457",
      ecoScore: 92,
      carbonFootprint: "2.1 kg CO₂",
      waterUsage: "45L",
      recyclable: true,
      certifications: ["GOTS", "Fair Trade", "Carbon Neutral"],
      description: "Made from 100% organic cotton with sustainable manufacturing processes.",
      alternatives: ["Hemp T-Shirt", "Bamboo Fiber Tee"],
    },
    {
      id: "2",
      name: "Plastic Water Bottle",
      brand: "AquaCorp",
      barcode: "5901234123464",
      ecoScore: 23,
      carbonFootprint: "8.7 kg CO₂",
      waterUsage: "180L",
      recyclable: true,
      certifications: [],
      description: "Single-use plastic bottle with high environmental impact.",
      alternatives: ["Reusable Steel Bottle", "Glass Water Bottle", "Bamboo Bottle"],
    },
  ],
  scanHistory: [],
  storeProducts: [
    {
      id: "1",
      name: "Bamboo Fiber Water Bottle",
      description:
        "Sustainable, BPA-free water bottle made from bamboo fiber composite. Perfect for Mumbai's hot climate.",
      price: 1999,
      originalPrice: 2799,
      discount: 29,
      rating: 4.8,
      reviews: 156,
      category: "drinkware",
      ecoScore: 95,
      certifications: ["BPA-Free", "Biodegradable", "Carbon Neutral"],
      image: "/bamboo-water-bottle-indian-brand.png",
      inStock: true,
      pointsReward: 25,
      ngoSupport: "Narmada Bachao Andolan",
    },
    {
      id: "2",
      name: "Khadi Cotton Tote Bag",
      description: "Durable, reusable tote bag made from 100% organic khadi cotton. Support Indian artisans.",
      price: 899,
      originalPrice: 1199,
      discount: 25,
      rating: 4.6,
      reviews: 89,
      category: "bags",
      ecoScore: 88,
      certifications: ["Khadi Certified", "Fair Trade"],
      image: "/khadi-cotton-tote-bag.png",
      inStock: true,
      pointsReward: 15,
      ngoSupport: "Khadi Gramodyog",
    },
    {
      id: "3",
      name: "Solar Power Bank",
      description:
        "Portable solar charger with 20,000mAh capacity for all your devices. Perfect for India's abundant sunshine.",
      price: 3999,
      originalPrice: 5599,
      discount: 29,
      rating: 4.7,
      reviews: 234,
      category: "electronics",
      ecoScore: 82,
      certifications: ["Energy Star", "RoHS Compliant"],
      image: "/solar-power-bank-20000mah.png",
      inStock: true,
      pointsReward: 50,
      ngoSupport: "Solar Energy Foundation India",
    },
    {
      id: "4",
      name: "Biodegradable Phone Case",
      description:
        "Protective phone case made from plant-based materials that naturally decompose. Designed for popular Indian smartphone models.",
      price: 1599,
      originalPrice: 1999,
      discount: 20,
      rating: 4.5,
      reviews: 67,
      category: "accessories",
      ecoScore: 91,
      certifications: ["Compostable", "Non-Toxic"],
      image: "/biodegradable-phone-case-indian-design.png",
      inStock: false,
      pointsReward: 20,
      ngoSupport: "Plastic Free India",
    },
    {
      id: "5",
      name: "Recycled Notebook Set",
      description: "Set of 3 notebooks made from 100% recycled paper with natural dyes. Made in Rajasthan.",
      price: 799,
      originalPrice: 1099,
      discount: 27,
      rating: 4.4,
      reviews: 45,
      category: "stationery",
      ecoScore: 86,
      certifications: ["FSC Certified", "Recycled Content"],
      image: "/recycled-notebook-rajasthan.png",
      inStock: true,
      pointsReward: 12,
      ngoSupport: "Chipko Movement Foundation",
    },
    {
      id: "6",
      name: "Ayurvedic Cleaning Kit",
      description:
        "Complete cleaning kit with plant-based, ayurvedic cleaning products. Chemical-free for Indian homes.",
      price: 2499,
      originalPrice: 3299,
      discount: 24,
      rating: 4.9,
      reviews: 178,
      category: "home",
      ecoScore: 94,
      certifications: ["Ayush Certified", "Cruelty-Free"],
      image: "/ayurvedic-cleaning-products.png",
      inStock: true,
      pointsReward: 35,
      ngoSupport: "Ganga Action Parivar",
    },
    {
      id: "7",
      name: "Jute Shopping Bag Set",
      description: "Set of 3 jute bags in different sizes. Made by women's cooperatives in West Bengal.",
      price: 649,
      originalPrice: 899,
      discount: 28,
      rating: 4.3,
      reviews: 92,
      category: "bags",
      ecoScore: 89,
      certifications: ["Fair Trade", "Women Empowerment"],
      image: "/handmade-jute-bags-bengal.png",
      inStock: true,
      pointsReward: 10,
      ngoSupport: "Self Employed Women's Association",
    },
    {
      id: "8",
      name: "Copper Water Bottle",
      description: "Traditional copper water bottle with ayurvedic benefits. Handcrafted in Moradabad.",
      price: 1299,
      originalPrice: 1699,
      discount: 24,
      rating: 4.7,
      reviews: 134,
      category: "drinkware",
      ecoScore: 92,
      certifications: ["Pure Copper", "Handcrafted"],
      image: "/copper-water-bottle-handcrafted.png",
      inStock: true,
      pointsReward: 18,
      ngoSupport: "Traditional Crafts Council",
    },
  ],
  cart: [],
  orders: [],
  trackerSnapshots: [],
  courseProgress: [],
}

const EcosphereContext = createContext<EcosphereContextValue | null>(null)

const loadState = () => {
  if (typeof window === "undefined") return null
  const stored = window.localStorage.getItem(getStorageKey())
  if (!stored) return null
  try {
    return JSON.parse(stored) as EcosphereState
  } catch {
    return null
  }
}

const persistState = (state: EcosphereState) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(getStorageKey(), JSON.stringify(state))
}

const clampPoints = (points: number) => Math.max(0, Math.round(points))

const computeLevel = (points: number) => Math.max(1, Math.floor(points / 250) + 1)

export function EcosphereProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EcosphereState>(seedState)

  // Load user-specific data on mount and when auth changes
  const loadUserData = () => {
    const stored = loadState()
    if (stored) {
      // Keep static data from seedState (products, events) but load user-specific data from storage
      setState({
        ...seedState,
        ...stored,
        // Always use latest product/event definitions from code, not from localStorage
        storeProducts: seedState.storeProducts,
        events: seedState.events,
        scannerProducts: seedState.scannerProducts,
      })
    } else {
      setState(seedState)
    }
  }

  useEffect(() => {
    loadUserData()

    // Listen for auth changes to reload user data
    const handleAuthChange = () => {
      loadUserData()
    }

    window.addEventListener("ecosphere-auth-change", handleAuthChange)
    return () => window.removeEventListener("ecosphere-auth-change", handleAuthChange)
  }, [])

  useEffect(() => {
    persistState(state)
  }, [state])

  const rsvpEvent = (eventId: string) => {
    setState((prev) => {
      if (prev.eventRsvps.includes(eventId)) return prev
      const updatedEvents = prev.events.map((event) =>
        event.id === eventId && event.attendees < event.maxAttendees
          ? { ...event, attendees: event.attendees + 1 }
          : event
      )
      const matchedEvent = prev.events.find((event) => event.id === eventId)
      const pointsToAdd = matchedEvent ? matchedEvent.points : 0
      const updatedUser = {
        ...prev.user,
        points: clampPoints(prev.user.points + pointsToAdd),
        eventsJoined: prev.user.eventsJoined + 1,
      }
      updatedUser.level = computeLevel(updatedUser.points)
      return {
        ...prev,
        events: updatedEvents,
        eventRsvps: [...prev.eventRsvps, eventId],
        user: updatedUser,
      }
    })
  }

  const cancelRsvp = (eventId: string) => {
    setState((prev) => {
      if (!prev.eventRsvps.includes(eventId)) return prev
      const updatedEvents = prev.events.map((event) =>
        event.id === eventId && event.attendees > 0 ? { ...event, attendees: event.attendees - 1 } : event
      )
      const matchedEvent = prev.events.find((event) => event.id === eventId)
      const pointsToRemove = matchedEvent ? matchedEvent.points : 0
      const updatedUser = {
        ...prev.user,
        points: clampPoints(prev.user.points - pointsToRemove),
        eventsJoined: Math.max(0, prev.user.eventsJoined - 1),
      }
      updatedUser.level = computeLevel(updatedUser.points)
      return {
        ...prev,
        events: updatedEvents,
        eventRsvps: prev.eventRsvps.filter((id) => id !== eventId),
        user: updatedUser,
      }
    })
  }

  const recordScan = (productId: string) => {
    setState((prev) => {
      const product = prev.scannerProducts.find((item) => item.id === productId)
      if (!product) return prev
      const pointsToAdd = product.ecoScore >= 80 ? 12 : product.ecoScore >= 60 ? 8 : 4
      const updatedUser = {
        ...prev.user,
        points: clampPoints(prev.user.points + pointsToAdd),
        productsScanned: prev.user.productsScanned + 1,
      }
      updatedUser.level = computeLevel(updatedUser.points)
      const historyItem: ScanHistoryItem = {
        id: crypto.randomUUID(),
        productId,
        scannedAt: new Date().toISOString(),
      }
      return {
        ...prev,
        scanHistory: [historyItem, ...prev.scanHistory].slice(0, 50),
        user: updatedUser,
      }
    })
  }

  const addToCart = (productId: string) => {
    setState((prev) => {
      const existing = prev.cart.find((item) => item.productId === productId)
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          ),
        }
      }
      return {
        ...prev,
        cart: [...prev.cart, { productId, quantity: 1 }],
      }
    })
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((item) => (item.productId === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    }))
  }

  const removeFromCart = (productId: string) => {
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.productId !== productId),
    }))
  }

  const checkoutCart = () => {
    setState((prev) => {
      if (prev.cart.length === 0) return prev
      const total = prev.cart.reduce((sum, item) => {
        const product = prev.storeProducts.find((storeItem) => storeItem.id === item.productId)
        return sum + (product ? product.price * item.quantity : 0)
      }, 0)
      const earnedPoints = prev.cart.reduce((sum, item) => {
        const product = prev.storeProducts.find((storeItem) => storeItem.id === item.productId)
        return sum + (product ? product.pointsReward * item.quantity : 0)
      }, 0)
      const updatedUser = {
        ...prev.user,
        points: clampPoints(prev.user.points + earnedPoints),
      }
      updatedUser.level = computeLevel(updatedUser.points)
      const order: Order = {
        id: crypto.randomUUID(),
        items: prev.cart,
        total,
        placedAt: new Date().toISOString(),
      }
      return {
        ...prev,
        cart: [],
        orders: [order, ...prev.orders],
        user: updatedUser,
      }
    })
  }

  const saveTrackerSnapshot = (snapshot: Omit<TrackerSnapshot, "id" | "date">) => {
    setState((prev) => {
      const newSnapshot: TrackerSnapshot = {
        ...snapshot,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      }
      const totalCarbon =
        snapshot.carbonData.electricity + snapshot.carbonData.transport + snapshot.carbonData.food + snapshot.carbonData.waste
      const earnedPoints = totalCarbon <= 20 ? 30 : totalCarbon <= 40 ? 20 : 10
      const lastSnapshot = prev.trackerSnapshots[0]
      const today = new Date()
      const lastDate = lastSnapshot ? new Date(lastSnapshot.date) : null
      const dayDiff = lastDate ? Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 1
      const nextStreak = dayDiff === 1 ? prev.user.currentStreak + 1 : dayDiff === 0 ? prev.user.currentStreak : 1
      const updatedUser = {
        ...prev.user,
        points: clampPoints(prev.user.points + earnedPoints),
        carbonSavedKg: prev.user.carbonSavedKg + Math.max(0, 40 - totalCarbon),
        currentStreak: nextStreak,
        longestStreak: Math.max(prev.user.longestStreak, nextStreak),
      }
      updatedUser.level = computeLevel(updatedUser.points)
      return {
        ...prev,
        trackerSnapshots: [newSnapshot, ...prev.trackerSnapshots].slice(0, 30),
        user: updatedUser,
      }
    })
  }

  const updateCourseProgress = (courseId: string, progress: number) => {
    setState((prev) => {
      const existing = prev.courseProgress.find((course) => course.id === courseId)
      if (existing) {
        return {
          ...prev,
          courseProgress: prev.courseProgress.map((course) =>
            course.id === courseId ? { ...course, progress } : course
          ),
        }
      }
      return {
        ...prev,
        courseProgress: [...prev.courseProgress, { id: courseId, progress }],
      }
    })
  }

  const value = useMemo(
    () => ({
      state,
      rsvpEvent,
      cancelRsvp,
      recordScan,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      checkoutCart,
      saveTrackerSnapshot,
      updateCourseProgress,
    }),
    [state]
  )

  return <EcosphereContext.Provider value={value}>{children}</EcosphereContext.Provider>
}

export function useEcosphere() {
  const context = useContext(EcosphereContext)
  if (!context) {
    throw new Error("useEcosphere must be used within EcosphereProvider")
  }
  return context
}
