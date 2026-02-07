"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  ArrowLeft,
  Award,
  Target,
  Calendar,
  Scan,
  TreePine,
  Recycle,
  Globe,
  Share,
  Crown,
  Medal,
  Shield,
  Flame,
  Gift,
  Star,
  Zap,
  Clock,
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useEcosphere } from "@/components/ecosphere-provider"

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview")
  const { state } = useEcosphere()
  const currentStreak = state.user.currentStreak
  const longestStreak = state.user.longestStreak
  const [streakMultiplier, setStreakMultiplier] = useState(1.5)

  const userStats = {
    name: state.user.name,
    level: state.user.level,
    totalPoints: state.user.points,
    nextLevelPoints: (state.user.level + 1) * 250,
    rank: state.user.rank,
    totalUsers: state.user.totalUsers,
    joinDate: state.user.joinDate,
    eventsJoined: state.user.eventsJoined,
    productsScanned: state.user.productsScanned,
    carbonSaved: `${(state.user.carbonSavedKg / 1000).toFixed(1)} tons`,
    treesPlanted: state.user.treesPlanted,
  }

  const seasonalChallenges = [
    {
      id: "earth-day-2025",
      title: "Earth Day Challenge 2025",
      description: "Complete 10 eco-activities during Earth Week",
      startDate: "2025-04-15",
      endDate: "2025-04-22",
      progress: 7,
      target: 10,
      reward: "500 points + Exclusive Earth Day Badge",
      status: "active",
      participants: 2847,
    },
    {
      id: "monsoon-green",
      title: "Monsoon Green Initiative",
      description: "Plant trees and collect rainwater during monsoon season",
      startDate: "2025-06-01",
      endDate: "2025-09-30",
      progress: 0,
      target: 5,
      reward: "300 points + Monsoon Warrior Badge",
      status: "upcoming",
      participants: 1256,
    },
    {
      id: "winter-warmth",
      title: "Winter Warmth Challenge",
      description: "Reduce energy consumption during winter months",
      startDate: "2024-12-01",
      endDate: "2025-02-28",
      progress: 15,
      target: 15,
      reward: "400 points + Energy Saver Badge",
      status: "completed",
      participants: 3421,
    },
  ]

  const streakRewards = [
    { days: 7, reward: "50 bonus points", claimed: true },
    { days: 14, reward: "100 bonus points", claimed: true },
    { days: 21, reward: "Streak Master Badge", claimed: false },
    { days: 30, reward: "200 bonus points + Special Title", claimed: false },
    { days: 50, reward: "Exclusive Avatar Frame", claimed: false },
    { days: 100, reward: "Legend Status + 500 points", claimed: false },
  ]

  const badges = [
    {
      id: "1",
      name: "Eco Warrior",
      description: "Joined 10+ environmental events in Mumbai",
      icon: Shield,
      earned: true,
      rarity: "rare",
      earnedDate: "2024-12-15",
    },
    {
      id: "2",
      name: "Scanner Pro",
      description: "Scanned 100+ products for sustainability info",
      icon: Scan,
      earned: true,
      rarity: "common",
      earnedDate: "2024-11-28",
    },
    {
      id: "3",
      name: "Tree Hugger",
      description: "Planted 5+ trees in Mumbai parks",
      icon: TreePine,
      earned: true,
      rarity: "uncommon",
      earnedDate: "2024-10-12",
    },
    {
      id: "7",
      name: "Streak Master",
      description: "Maintained 21-day activity streak",
      icon: Flame,
      earned: false,
      rarity: "epic",
      earnedDate: null,
    },
    {
      id: "8",
      name: "Earth Day Champion",
      description: "Completed Earth Day Challenge 2024",
      icon: Globe,
      earned: true,
      rarity: "legendary",
      earnedDate: "2024-04-22",
    },
    {
      id: "4",
      name: "Community Leader",
      description: "Organized an environmental event in Mumbai",
      icon: Crown,
      earned: false,
      rarity: "legendary",
      earnedDate: null,
    },
    {
      id: "5",
      name: "Carbon Crusher",
      description: "Saved 5+ tons of CO₂ through eco-actions",
      icon: Globe,
      earned: false,
      rarity: "epic",
      earnedDate: null,
    },
    {
      id: "6",
      name: "Recycling Champion",
      description: "Participated in 5+ cleanup events in Mumbai",
      icon: Recycle,
      earned: true,
      rarity: "uncommon",
      earnedDate: "2024-09-20",
    },
  ]

  const recentActivities = useMemo(() => {
    const eventActivities = state.eventRsvps
      .map((eventId) => state.events.find((event) => event.id === eventId))
      .filter(Boolean)
      .map((event) => ({
        id: `event-${event?.id}`,
        type: "event",
        title: `Joined ${event?.title}`,
        points: event?.points ?? 0,
        streakBonus: Math.round((event?.points ?? 0) * 0.1),
        date: event?.date ?? new Date().toISOString(),
        icon: Recycle,
      }))

    const scanActivities = state.scanHistory.map((scan) => {
      const product = state.scannerProducts.find((item) => item.id === scan.productId)
      const points = product ? (product.ecoScore >= 80 ? 12 : product.ecoScore >= 60 ? 8 : 4) : 0
      return {
        id: `scan-${scan.id}`,
        type: "scan",
        title: `Scanned ${product?.name ?? "a product"}`,
        points,
        streakBonus: Math.round(points * 0.1),
        date: scan.scannedAt,
        icon: Scan,
      }
    })

    const orderActivities = state.orders.map((order) => ({
      id: `order-${order.id}`,
      type: "order",
      title: "Completed eco-friendly order",
      points: Math.round(order.total / 100),
      streakBonus: Math.round(order.total / 1000),
      date: order.placedAt,
      icon: Gift,
    }))

    return [...eventActivities, ...scanActivities, ...orderActivities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
  }, [state.eventRsvps, state.events, state.scanHistory, state.scannerProducts, state.orders])

  const leaderboard = [
    { rank: 1, name: "Priya Patel", points: 4250, avatar: "PP", streak: 45 },
    { rank: 2, name: "Rahul Mehta", points: 3890, avatar: "RM", streak: 32 },
    { rank: 3, name: "Sneha Gupta", points: 3650, avatar: "SG", streak: 28 },
    { rank: 47, name: "Arjun Sharma (You)", points: 2450, avatar: "AS", isUser: true, streak: 15 },
    { rank: 48, name: "Vikram Singh", points: 2380, avatar: "VS", streak: 12 },
  ]

  useEffect(() => {
    const streakInterval = setInterval(() => {
      if (!recentActivities[0]) return
      const now = new Date()
      const lastActivity = new Date(recentActivities[0].date)
      const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        // Activity today, maintain streak
        setStreakMultiplier(1 + currentStreak * 0.1) // 10% bonus per streak day
      }
    }, 5000)

    return () => clearInterval(streakInterval)
  }, [currentStreak, recentActivities])

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "border-gray-300 bg-gray-50",
      uncommon: "border-green-300 bg-green-50",
      rare: "border-blue-300 bg-blue-50",
      epic: "border-purple-300 bg-purple-50",
      legendary: "border-yellow-300 bg-yellow-50",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const getRarityBadge = (rarity: string): "default" | "secondary" | "outline" => {
    const variants = {
      common: "secondary",
      uncommon: "default",
      rare: "default",
      epic: "default",
      legendary: "default",
    }
    return variants[rarity as keyof typeof variants] || "secondary"
  }

  const getChallengeStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b px-4 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold font-serif">Eco Profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center border-4 border-green-300">
                <span className="text-2xl font-bold text-green-800 font-mono">AS</span>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold text-green-900 font-serif">{userStats.name}</h2>
                <p className="text-green-700">Level {userStats.level} Eco Warrior</p>
                <p className="text-sm text-green-600">Member since {userStats.joinDate}</p>
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-700">Progress to Level {userStats.level + 1}</span>
                    <span className="text-sm font-mono text-green-800">
                      {userStats.totalPoints}/{userStats.nextLevelPoints}
                    </span>
                  </div>
                  <Progress value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} className="h-3" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-800 font-mono">{userStats.totalPoints}</div>
                <div className="text-sm text-green-600">Total Points</div>
                <div className="mt-2">
                  <Badge variant="outline" className="flex items-center gap-1 border-green-300 text-green-700">
                    <Medal className="h-3 w-3" />
                    Rank #{userStats.rank}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800 font-serif">
                <Flame className="h-5 w-5" />
                Activity Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-900 font-mono">{currentStreak}</div>
                  <div className="text-sm text-orange-700">Days in a row</div>
                  <div className="text-xs text-orange-600 mt-1">
                    Longest: {longestStreak} days | Multiplier: {streakMultiplier.toFixed(1)}x
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-orange-800">Next Rewards:</div>
                  {streakRewards
                    .filter((reward) => reward.days > currentStreak)
                    .slice(0, 2)
                    .map((reward, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-orange-700">{reward.days} days:</span>
                        <span className="text-orange-800 font-medium">{reward.reward}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-purple-800 font-serif">
                <Gift className="h-5 w-5" />
                Streak Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {streakRewards.slice(0, 4).map((reward, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      reward.claimed
                        ? "bg-green-100 border border-green-200"
                        : currentStreak >= reward.days
                          ? "bg-yellow-100 border border-yellow-200"
                          : "bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-mono">{reward.days}d</div>
                      <div className="text-sm">{reward.reward}</div>
                    </div>
                    <div>
                      {reward.claimed ? (
                        <Badge className="bg-green-600 text-white">Claimed</Badge>
                      ) : currentStreak >= reward.days ? (
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                          Claim
                        </Button>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold font-mono">{userStats.eventsJoined}</div>
              <div className="text-sm text-gray-600">Events Joined</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 text-center">
              <Scan className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold font-mono">{userStats.productsScanned}</div>
              <div className="text-sm text-gray-600">Products Scanned</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 text-center">
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold font-mono">{userStats.carbonSaved}</div>
              <div className="text-sm text-gray-600">CO₂ Saved</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 text-center">
              <TreePine className="h-8 w-8 text-green-700 mx-auto mb-2" />
              <div className="text-2xl font-bold font-mono">{userStats.treesPlanted}</div>
              <div className="text-sm text-gray-600">Trees Planted</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Recent Activity</CardTitle>
                <CardDescription>Your latest eco-friendly actions with streak bonuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors border border-gray-100"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.title}</div>
                          <div className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600 font-mono">+{activity.points}</div>
                          {activity.streakBonus > 0 && (
                            <div className="text-xs text-orange-600 font-mono">
                              +{activity.streakBonus} streak bonus
                            </div>
                          )}
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Achievement Badges</CardTitle>
                <CardDescription>Collect badges by completing eco-friendly activities in Mumbai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge) => {
                    const Icon = badge.icon
                    return (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          badge.earned
                            ? `${getRarityColor(badge.rarity)} hover:scale-105 shadow-sm`
                            : "border-gray-200 bg-gray-50 opacity-60"
                        }`}
                      >
                        <div className="text-center">
                          <div
                            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 ${
                              badge.earned ? "bg-green-200" : "bg-gray-200"
                            }`}
                          >
                            <Icon className={`h-8 w-8 ${badge.earned ? "text-green-700" : "text-gray-400"}`} />
                          </div>
                          <h3 className="font-semibold mb-1 font-serif">{badge.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{badge.description}</p>
                          <Badge variant={getRarityBadge(badge.rarity)} className="mb-2 capitalize">
                            {badge.rarity}
                          </Badge>
                          {badge.earned && badge.earnedDate && (
                            <div className="text-xs text-gray-500 font-mono">
                              Earned {new Date(badge.earnedDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Seasonal Challenges</CardTitle>
                <CardDescription>Special time-limited challenges with exclusive rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {seasonalChallenges.map((challenge) => (
                    <Card key={challenge.id} className="border-2 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-serif">{challenge.title}</CardTitle>
                            <CardDescription className="mt-1">{challenge.description}</CardDescription>
                          </div>
                          <Badge className={getChallengeStatusColor(challenge.status)} variant="outline">
                            {challenge.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span className="font-mono">
                              {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                              {new Date(challenge.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span className="font-mono">{challenge.participants.toLocaleString()} participants</span>
                          </div>
                        </div>

                        {challenge.status !== "upcoming" && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span className="font-mono">
                                {challenge.progress}/{challenge.target}
                              </span>
                            </div>
                            <Progress value={(challenge.progress / challenge.target) * 100} className="h-3" />
                          </div>
                        )}

                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Gift className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-800">Reward:</span>
                          </div>
                          <span className="text-sm text-yellow-700">{challenge.reward}</span>
                        </div>

                        <div className="flex gap-2">
                          {challenge.status === "active" && (
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                              <Zap className="h-4 w-4 mr-2" />
                              Join Challenge
                            </Button>
                          )}
                          {challenge.status === "upcoming" && (
                            <Button variant="outline" className="flex-1 bg-transparent">
                              <Clock className="h-4 w-4 mr-2" />
                              Set Reminder
                            </Button>
                          )}
                          {challenge.status === "completed" && (
                            <Button variant="outline" className="flex-1 bg-transparent" disabled>
                              <Award className="h-4 w-4 mr-2" />
                              Completed
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Community Leaderboard</CardTitle>
                <CardDescription>See how you rank among other eco-warriors in Mumbai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                        user.isUser
                          ? "bg-green-100 border border-green-300 shadow-sm"
                          : "hover:bg-gray-50 border border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono ${
                            user.rank <= 3 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.rank <= 3 ? (user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉") : user.rank}
                        </div>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium font-mono">{user.avatar}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium font-serif ${user.isUser ? "text-green-800" : ""}`}>
                          {user.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="font-mono">{user.streak} day streak</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold font-mono">{user.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Share className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Target className="h-4 w-4 mr-2" />
            Set Goals
          </Button>
        </div>
      </div>
    </div>
  )
}
