"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookOpen, Newspaper, Lightbulb, Play, Clock, Users, Star, ChevronRight, ExternalLink, RefreshCw } from "lucide-react"
import { useEcosphere } from "@/components/ecosphere-provider"

type NewsArticle = {
  title: string
  description: string
  url: string
  image: string | null
  publishedAt: string
  source: { name: string; url: string }
}

export default function LearnPage() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [tipOfDay, setTipOfDay] = useState(0)
  const { state, updateCourseProgress } = useEcosphere()

  // Live news state
  const [liveNews, setLiveNews] = useState<NewsArticle[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState<string | null>(null)

  // Fetch live environmental news
  // Only show news containing these specific keywords
  const requiredKeywords = ['climate', 'environment', 'air', 'pollution']
  const excludeKeywords = ['trump']

  const isEnvironmentalNews = (article: NewsArticle) => {
    const text = `${article.title} ${article.description}`.toLowerCase()
    const hasRequired = requiredKeywords.some(keyword => text.includes(keyword))
    const hasExcluded = excludeKeywords.some(keyword => text.includes(keyword))
    return hasRequired && !hasExcluded
  }

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true)
        setNewsError(null)
        const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY
        if (!apiKey) {
          throw new Error("API key not configured")
        }
        const response = await fetch(
          `https://gnews.io/api/v4/search?q="climate change" OR "air pollution" OR "renewable energy" OR "global warming" OR "carbon emissions"&lang=en&max=20&apikey=${apiKey}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch news")
        }
        const data = await response.json()
        // Filter to only environmental news
        const filtered = (data.articles || []).filter(isEnvironmentalNews).slice(0, 8)
        setLiveNews(filtered)
      } catch (err) {
        setNewsError(err instanceof Error ? err.message : "Failed to load news")
      } finally {
        setNewsLoading(false)
      }
    }
    fetchNews()
  }, [])

  const refreshNews = async () => {
    setNewsLoading(true)
    setNewsError(null)
    try {
      const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY
      const response = await fetch(
        `https://gnews.io/api/v4/search?q="climate change" OR "air pollution" OR "renewable energy" OR "global warming" OR "carbon emissions"&lang=en&max=20&apikey=${apiKey}`
      )
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      const filtered = (data.articles || []).filter(isEnvironmentalNews).slice(0, 8)
      setLiveNews(filtered)
    } catch {
      setNewsError("Failed to refresh news")
    } finally {
      setNewsLoading(false)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }

  const ecoTips = [
    {
      title: "Switch to LED Bulbs",
      description:
        "LED bulbs use 75% less energy and last 25 times longer than incandescent bulbs. A single LED can save ₹2,000 over its lifetime.",
      category: "Energy",
      impact: "High",
      difficulty: "Easy",
    },
    {
      title: "Start Composting Kitchen Waste",
      description:
        "Turn your vegetable peels and food scraps into nutrient-rich compost. Reduces waste by 30% and creates free fertilizer for plants.",
      category: "Waste",
      impact: "Medium",
      difficulty: "Medium",
    },
    {
      title: "Use Public Transport in Mumbai",
      description:
        "Mumbai Local trains carry 7.5 million passengers daily with minimal carbon footprint per person. Switch from car to train for 50% emission reduction.",
      category: "Transport",
      impact: "High",
      difficulty: "Easy",
    },
    {
      title: "Install a Water Filter",
      description:
        "Avoid plastic bottles by filtering tap water. A good filter saves ₹15,000 annually and prevents 1,500 plastic bottles from entering landfills.",
      category: "Water",
      impact: "Medium",
      difficulty: "Easy",
    },
    {
      title: "Grow Indoor Plants",
      description:
        "Plants like Money Plant and Snake Plant purify indoor air naturally. They remove toxins and increase oxygen levels in your Mumbai home.",
      category: "Air Quality",
      impact: "Low",
      difficulty: "Easy",
    },
  ]

  const courses = [
    {
      id: "composting",
      title: "Home Composting Mastery",
      description: "Learn to turn kitchen waste into black gold for your plants",
      duration: "2 hours",
      modules: 6,
      difficulty: "Beginner",
      enrolled: 1247,
      rating: 4.8,
      progress: 0,
      image: "/indian-home-composting.png",
    },
    {
      id: "solar",
      title: "Solar Energy for Mumbai Homes",
      description: "Complete guide to installing and maintaining solar panels in urban India",
      duration: "3 hours",
      modules: 8,
      difficulty: "Intermediate",
      enrolled: 892,
      rating: 4.9,
      progress: 25,
      image: "/mumbai-rooftop-solar.png",
    },
    {
      id: "water",
      title: "Water Conservation Techniques",
      description: "Practical methods to reduce water usage and harvest rainwater",
      duration: "1.5 hours",
      modules: 5,
      difficulty: "Beginner",
      enrolled: 2156,
      rating: 4.7,
      progress: 60,
      image: "/rainwater-harvesting.png",
    },
    {
      id: "waste",
      title: "Zero Waste Living",
      description: "Transform your lifestyle to minimize waste and maximize sustainability",
      duration: "4 hours",
      modules: 10,
      difficulty: "Advanced",
      enrolled: 634,
      rating: 4.9,
      progress: 0,
      image: "/zero-waste-sustainable-living.png",
    },
  ]

  const courseProgressMap = new Map(state.courseProgress.map((course) => [course.id, course.progress]))
  const coursesWithProgress = courses.map((course) => ({
    ...course,
    progress: courseProgressMap.get(course.id) ?? course.progress,
  }))

  // Fallback static news (used if API fails)
  const fallbackNews = [
    {
      title: "Mumbai's Air Quality Improves by 15% This Monsoon",
      description: "Recent data shows significant improvement in AQI levels across Mumbai due to increased green cover and reduced vehicular emissions.",
      source: { name: "Times of India", url: "#" },
      publishedAt: new Date().toISOString(),
      image: "/mumbai-air-quality-improvement.png",
      url: "#",
    },
    {
      title: "India Launches World's Largest Solar Park in Rajasthan",
      description: "The 2,000 MW solar park will power 2 million homes and reduce carbon emissions by 4 million tons annually.",
      source: { name: "Economic Times", url: "#" },
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      image: "/india-solar-park-rajasthan.png",
      url: "#",
    },
  ]

  const displayNews = liveNews.length > 0 ? liveNews : (newsError ? fallbackNews : [])

  const nextTip = () => {
    setTipOfDay((prev) => (prev + 1) % ecoTips.length)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCourseAction = (courseId: string, currentProgress: number) => {
    const nextProgress = currentProgress === 0 ? 10 : Math.min(100, currentProgress + 10)
    updateCourseProgress(courseId, nextProgress)
    setSelectedCourse(courseId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-serif">EcoLearn Hub</h1>
            <p className="text-gray-600 mt-2">Expand your environmental knowledge and skills</p>
          </div>
        </div>

        <Tabs defaultValue="tips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tips" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Daily Eco-Tips
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Green Courses
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="h-4 w-4" />
              Environmental News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tips" className="space-y-6">
            <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between font-serif">
                  <span className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-green-600" />
                    Today&apos;s Eco-Tip
                  </span>
                  <Button variant="outline" size="sm" onClick={nextTip}>
                    Next Tip
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 mb-3">
                    <Badge className={getDifficultyColor(ecoTips[tipOfDay].difficulty)}>
                      {ecoTips[tipOfDay].difficulty}
                    </Badge>
                    <Badge className={getImpactColor(ecoTips[tipOfDay].impact)}>
                      {ecoTips[tipOfDay].impact} Impact
                    </Badge>
                    <Badge variant="outline">{ecoTips[tipOfDay].category}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 font-serif">{ecoTips[tipOfDay].title}</h3>
                  <p className="text-green-700 leading-relaxed">{ecoTips[tipOfDay].description}</p>
                  <Button className="bg-green-600 hover:bg-green-700">Learn More</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ecoTips.map((tip, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex gap-2 mb-2">
                      <Badge className={getDifficultyColor(tip.difficulty)} variant="secondary">
                        {tip.difficulty}
                      </Badge>
                      <Badge className={getImpactColor(tip.impact)} variant="secondary">
                        {tip.impact}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-serif">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <Badge variant="outline">{tip.category}</Badge>
                      <Button variant="ghost" size="sm" className="text-green-600">
                        Try This <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coursesWithProgress.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <Image
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{course.difficulty}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-mono">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="font-serif">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {course.enrolled.toLocaleString()} enrolled
                        </span>
                      </div>

                      {course.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span className="font-mono">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      <Button
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleCourseAction(course.id, course.progress)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {course.progress > 0 ? "Continue Learning" : "Start Course"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedCourse && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="font-serif">Course Preview</CardTitle>
                  <CardDescription>
                    You selected: {coursesWithProgress.find((c) => c.id === selectedCourse)?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 mb-4">
                    This course includes interactive modules, practical exercises, and real-world applications
                    specifically designed for Indian environmental conditions and Mumbai&apos;s urban challenges.
                  </p>
                  <div className="flex gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">Enroll Now - Free</Button>
                    <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                      Close Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {/* Live News Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Live Environmental News</span>
              </div>
              <Button variant="outline" size="sm" onClick={refreshNews} disabled={newsLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${newsLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {/* Loading State */}
            {newsLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="w-24 h-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {newsError && !newsLoading && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="py-4">
                  <p className="text-yellow-800 text-sm">⚠️ {newsError}. Showing cached news.</p>
                </CardContent>
              </Card>
            )}

            {/* News Grid */}
            {!newsLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {displayNews.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <div className="flex gap-4 p-6">
                      <div className="flex-shrink-0">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-24 h-20 object-cover rounded-lg bg-gray-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg"
                            }}
                          />
                        ) : (
                          <div className="w-24 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <Newspaper className="h-8 w-8 text-green-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">Environment</Badge>
                          <span className="text-xs text-gray-500 font-mono">{getTimeAgo(article.publishedAt)}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 font-serif leading-tight line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{article.description}</p>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xs text-gray-500">{article.source.name}</span>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              Read More <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200">
              <CardHeader>
                <CardTitle className="font-serif">Stay Updated</CardTitle>
                <CardDescription>
                  Get personalized environmental news based on your interests and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap mb-4">
                  <Badge variant="outline">Mumbai</Badge>
                  <Badge variant="outline">Air Quality</Badge>
                  <Badge variant="outline">Solar Energy</Badge>
                  <Badge variant="outline">Waste Management</Badge>
                  <Badge variant="outline">Climate Policy</Badge>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Customize News Feed</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
