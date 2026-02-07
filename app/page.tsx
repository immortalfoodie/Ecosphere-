"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Image from "next/image"
import {
  Scan,
  Calendar,
  Trophy,
  ShoppingBag,
  Users,
  Leaf,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Heart,
  Award,
  Target,
  BarChart3,
  Recycle,
  TreePine,
  Droplets,
  BookOpen,
  Lightbulb,
  Wind,
  LogIn,
  User,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"

export default function EcosphereLanding() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState({
    events: 0,
    products: 0,
    trees: 0,
    users: 0,
  })
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [userLocation, setUserLocation] = useState("Loading...")
  const [nearbyEvents, setNearbyEvents] = useState(3)

  useEffect(() => {
    setIsVisible(true)

    const animateCounter = (key: keyof typeof counters, target: number) => {
      let current = 0
      const increment = target / 150
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
      }, 15)
    }

    const timer = setTimeout(() => {
      animateCounter("events", 2847)
      animateCounter("products", 18432)
      animateCounter("trees", 1567)
      animateCounter("users", 9234)
    }, 800)

    const clockTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    setTimeout(() => {
      setUserLocation("Your area")
      setNearbyEvents(Math.floor(Math.random() * 8) + 2)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(clockTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-full">
            <Image
              src="/mumbai-green-skyline.png"
              alt="Green city skyline"
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 40vw, 100vw"
              className="object-cover opacity-10"
            />
          </div>
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-accent/5 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-12 h-12 bg-chart-3/5 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div
          className={`max-w-6xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 group">
              <Leaf className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-2xl font-bold text-primary font-mono">Ecosphere</span>
            </div>
            {/* Login/Profile Button */}
            {user ? (
              <Link href="/profile">
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.name.split(' ')[0]}
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <LogIn className="h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight font-serif">
            Make sustainability{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              easy, engaging, and rewarding
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Ecosphere is an AI-enabled, community-driven platform that turns environmental awareness into real-world
            action. Scan products, join local eco-events, earn rewards, and track your impact in one unified ecosystem.
          </p>

          <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-mono">{currentTime ? currentTime.toLocaleTimeString("en-IN") : "--:--"}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-mono">{userLocation}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span className="font-mono">{nearbyEvents} events nearby</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scanner">
              <Button
                size="lg"
                className="text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 font-serif"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/learn">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent hover:bg-primary/5 transition-all duration-300 font-serif"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-primary mb-2 font-mono">
                {counters.users.toLocaleString("en-IN")}+
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 font-serif">
                <Users className="h-4 w-4" />
                Active Users
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-accent mb-2 font-mono">
                {counters.events.toLocaleString("en-IN")}+
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 font-serif">
                <Calendar className="h-4 w-4" />
                Eco Events
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-chart-3 mb-2 font-mono">
                {counters.products.toLocaleString("en-IN")}+
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 font-serif">
                <Scan className="h-4 w-4" />
                Products Scanned
              </div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold text-chart-4 mb-2 font-mono">
                {counters.trees.toLocaleString("en-IN")}+
              </div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 font-serif">
                <TreePine className="h-4 w-4" />
                Trees Planted
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12 font-serif">Complete Feature Set</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/scanner">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-primary/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Scan className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Barcode Scanner: Scan & Learn</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    AI Powered
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Scan everyday products to see carbon footprint estimates, sustainability scores, recyclability, and
                    eco-friendly alternatives.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <BarChart3 className="h-4 w-4" />
                    <span>Real-time data</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/events">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-accent/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Calendar className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Tree Plantation & Eco Events</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    Community
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Discover cleanups, plantation drives, and NGO campaigns. RSVP, get reminders, and earn points for
                    participation.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <MapPin className="h-4 w-4" />
                    <span>Local action map</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tracker">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-blue-300/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <BarChart3 className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Carbon-Impact Tracker</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    Analytics
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Monitor your footprint, waste reduction, and sustainable choices with clear, actionable analytics.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <Target className="h-4 w-4" />
                    <span>Daily tracking</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/profile">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-chart-3/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-chart-3/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-chart-3/20 transition-colors">
                    <Trophy className="h-8 w-8 text-chart-3 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Eco Profile & Gamification</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    Rewards
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Earn points, badges, and levels for eco-actions. Track progress, share achievements, and climb
                    leaderboards.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <Award className="h-4 w-4" />
                    <span>Achievement system</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/learn">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-purple-300/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <BookOpen className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Daily Eco Tips & Alerts</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    Education
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Get minimal-effort sustainability tips, environmental alerts, and policy updates tailored to you.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <Lightbulb className="h-4 w-4" />
                    <span>Timely guidance</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/services">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-green-300/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <MapPin className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Wildlife First Aid & Trails</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    Care & Explore
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Learn emergency steps for injured wildlife, find nearby rescue centers, and discover local nature
                    trails and eco-hotspots.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <Wind className="h-4 w-4" />
                    <span>Local guidance</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store">
              <Card className="text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group border-2 hover:border-chart-4/20 cursor-pointer">
                <CardHeader>
                  <div className="mx-auto bg-chart-4/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-chart-4/20 transition-colors">
                    <ShoppingBag className="h-8 w-8 text-chart-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <CardTitle className="text-xl font-serif">Eco-Merch & NGO Support</CardTitle>
                  <Badge variant="secondary" className="w-fit mx-auto font-mono">
                    Marketplace
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    Shop eco-friendly products and physical badges. Donations and purchases directly support NGO
                    partners, with points redeemable for discounts.
                  </CardDescription>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-mono">
                    <Heart className="h-4 w-4" />
                    <span>NGO support</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Track Your Environmental Impact */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6 font-serif">Track Your Environmental Impact</h2>
          <p className="text-lg text-muted-foreground mb-12">
            See how your daily choices contribute to measurable environmental impact
          </p>

          <div className="mb-12">
            <Image
              src="/indian-environmental-dashboard.png"
              alt="Environmental Impact Dashboard"
              width={1100}
              height={700}
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 70vw, 100vw"
              className="w-full max-w-xl mx-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Recycle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-serif">Carbon Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2 font-mono">2.4 tons</div>
                <Progress value={68} className="mb-2" />
                <p className="text-sm text-muted-foreground font-mono">This month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <Droplets className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg font-serif">Water Conserved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent mb-2 font-mono">1,250L</div>
                <Progress value={82} className="mb-2" />
                <p className="text-sm text-muted-foreground font-mono">This month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="w-12 h-12 mx-auto bg-chart-3/10 rounded-full flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle className="text-lg font-serif">Energy Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-3 mb-2 font-mono">340 kWh</div>
                <Progress value={75} className="mb-2" />
                <p className="text-sm text-muted-foreground font-mono">This month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Join a Community That Acts</h2>
            <p className="text-lg text-muted-foreground">
              Connect with NGOs, join local initiatives, and support environmental missions with real-world impact.
            </p>
          </div>

          <div className="mb-12 grid md:grid-cols-2 gap-6">
            <Image
              src="/indian-volunteers-beach-tree.png"
              alt="Mumbai Beach Cleanup"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 70vw, 100vw"
              className="w-full rounded-lg shadow-lg"
            />
            <Image
              src="/indian-tree-planting.png"
              alt="Community Tree Planting"
              width={1200}
              height={800}
              sizes="(min-width: 1024px) 50vw, (min-width: 768px) 70vw, 100vw"
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  <CardTitle className="font-serif">NGO Partnerships</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  NGOs create campaigns, manage volunteers, and track donations through dedicated portals. Admin tools
                  provide analytics and platform governance.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono">Verified NGO profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono">Campaign & volunteer tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-accent" />
                  <CardTitle className="font-serif">Success Stories</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  &quot;Ecosphere helped me discover local cleanups and track my impact. The rewards keep me motivated to
                  build sustainable habits every day.&quot;
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="font-mono">
                    Community Member
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2 font-mono">4.8/5 rating</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-chart-4" />
                  <CardTitle className="font-serif">Real Impact</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Events Joined</span>
                    <span className="font-semibold text-primary font-mono">
                      {counters.events.toLocaleString("en-IN")}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Products Scanned</span>
                    <span className="font-semibold text-accent font-mono">
                      {counters.products.toLocaleString("en-IN")}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trees Planted</span>
                    <span className="font-semibold text-chart-3 font-mono">
                      {counters.trees.toLocaleString("en-IN")}+
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CO₂ Reduced</span>
                    <span className="font-semibold text-chart-4 font-mono">45 tonnes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-500/5 rounded-full animate-pulse"></div>
          <div
            className="absolute bottom-10 right-10 w-24 h-24 bg-green-500/5 rounded-full animate-bounce"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-serif">
            Be part of the Ecosphere Movement 🌱
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            One small action can change the planet. Start your sustainable journey today and build real eco habits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button
                size="lg"
                className="text-lg px-12 py-6 group hover:scale-105 transition-all duration-300 font-serif"
              >
                Join Now
                <Leaf className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 hover:bg-primary/5 transition-all duration-300 bg-transparent font-serif"
            >
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group">
                <Leaf className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xl font-bold text-primary font-mono">Ecosphere</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Building a sustainable future through technology, community, and meaningful action.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-mono">Trusted by 9,234+ eco-warriors worldwide</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-serif">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/scanner" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Scan className="h-4 w-4" />
                    Product Scanner
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Local Events
                  </Link>
                </li>
                <li>
                  <Link href="/tracker" className="hover:text-primary transition-colors flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Impact Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/learn" className="hover:text-primary transition-colors flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Learning Hub
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    Local Services
                  </Link>
                </li>
                <li>
                  <Link href="/store" className="hover:text-primary transition-colors flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Eco Store
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Rewards
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-serif">Community</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    NGO Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Leaderboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4 font-serif">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p className="font-mono">
              &copy; 2025 Ecosphere. All rights reserved. Built with 💚 for our planet.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
