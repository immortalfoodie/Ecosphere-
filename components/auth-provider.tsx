"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type User = {
    email: string
    name: string
    createdAt: string
}

type AuthContextValue = {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
    logout: () => void
}

const AUTH_STORAGE_KEY = "ecosphere-auth"
const USERS_STORAGE_KEY = "ecosphere-users"

const AuthContext = createContext<AuthContextValue | null>(null)

// Simple hash function for password (NOT for production - use bcrypt in real apps)
const simpleHash = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }
    return hash.toString(36)
}

type StoredUser = {
    email: string
    name: string
    passwordHash: string
    createdAt: string
}

const getStoredUsers = (): StoredUser[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    if (!stored) return []
    try {
        return JSON.parse(stored)
    } catch {
        return []
    }
}

const saveStoredUsers = (users: StoredUser[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const getAuthSession = (): User | null => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null
    try {
        return JSON.parse(stored)
    } catch {
        return null
    }
}

const saveAuthSession = (user: User | null) => {
    if (typeof window === "undefined") return
    if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
    } else {
        localStorage.removeItem(AUTH_STORAGE_KEY)
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const session = getAuthSession()
        setUser(session)
        setIsLoading(false)
    }, [])

    const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const users = getStoredUsers()
        const normalizedEmail = email.toLowerCase().trim()
        const foundUser = users.find(u => u.email === normalizedEmail)

        if (!foundUser) {
            return { success: false, error: "No account found with this email" }
        }

        if (foundUser.passwordHash !== simpleHash(password)) {
            return { success: false, error: "Incorrect password" }
        }

        const sessionUser: User = {
            email: foundUser.email,
            name: foundUser.name,
            createdAt: foundUser.createdAt,
        }

        setUser(sessionUser)
        saveAuthSession(sessionUser)

        // Trigger storage event for ecosphere provider to reload
        window.dispatchEvent(new Event("ecosphere-auth-change"))

        return { success: true }
    }, [])

    const signup = useCallback(async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        if (!email || !password || !name) {
            return { success: false, error: "All fields are required" }
        }

        if (password.length < 6) {
            return { success: false, error: "Password must be at least 6 characters" }
        }

        const users = getStoredUsers()
        const normalizedEmail = email.toLowerCase().trim()

        if (users.find(u => u.email === normalizedEmail)) {
            return { success: false, error: "An account with this email already exists" }
        }

        const newUser: StoredUser = {
            email: normalizedEmail,
            name: name.trim(),
            passwordHash: simpleHash(password),
            createdAt: new Date().toISOString(),
        }

        saveStoredUsers([...users, newUser])

        const sessionUser: User = {
            email: newUser.email,
            name: newUser.name,
            createdAt: newUser.createdAt,
        }

        setUser(sessionUser)
        saveAuthSession(sessionUser)

        // Trigger storage event for ecosphere provider to reload
        window.dispatchEvent(new Event("ecosphere-auth-change"))

        return { success: true }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        saveAuthSession(null)
        window.dispatchEvent(new Event("ecosphere-auth-change"))
    }, [])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}
