"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Mail, Lock, User, ArrowLeft, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
    const router = useRouter()
    const { login, signup } = useAuth()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Login form state
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")

    // Signup form state
    const [signupName, setSignupName] = useState("")
    const [signupEmail, setSignupEmail] = useState("")
    const [signupPassword, setSignupPassword] = useState("")
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        const result = await login(loginEmail, loginPassword)

        if (result.success) {
            router.push("/")
        } else {
            setError(result.error || "Login failed")
        }

        setIsLoading(false)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (signupPassword !== signupConfirmPassword) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)

        const result = await signup(signupEmail, signupPassword, signupName)

        if (result.success) {
            router.push("/")
        } else {
            setError(result.error || "Signup failed")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>

                <Card className="shadow-xl border-0">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Leaf className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl font-bold font-serif">Welcome to Ecosphere</CardTitle>
                        <CardDescription>
                            Sign in to track your environmental impact and earn rewards
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Login Tab */}
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="your@email.com"
                                                className="pl-10"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="login-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Signup Tab */}
                            <TabsContent value="signup">
                                <form onSubmit={handleSignup} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-name"
                                                type="text"
                                                placeholder="Your Name"
                                                className="pl-10"
                                                value={signupName}
                                                onChange={(e) => setSignupName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="your@email.com"
                                                className="pl-10"
                                                value={signupEmail}
                                                onChange={(e) => setSignupEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-password"
                                                type="password"
                                                placeholder="At least 6 characters"
                                                className="pl-10"
                                                value={signupPassword}
                                                onChange={(e) => setSignupPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-confirm">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="signup-confirm"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10"
                                                value={signupConfirmPassword}
                                                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                        {/* Features Preview */}
                        <div className="mt-6 pt-6 border-t">
                            <p className="text-xs text-center text-gray-500 mb-3">Join to unlock:</p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="text-xs text-gray-600">
                                    <div className="text-lg mb-1">🌱</div>
                                    Track Impact
                                </div>
                                <div className="text-xs text-gray-600">
                                    <div className="text-lg mb-1">🏆</div>
                                    Earn Badges
                                </div>
                                <div className="text-xs text-gray-600">
                                    <div className="text-lg mb-1">🛒</div>
                                    Shop Eco
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
