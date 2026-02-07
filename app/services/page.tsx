"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  MapPin,
  Wind,
  Recycle,
  AlertTriangle,
  CheckCircle,
  Navigation,
  Phone,
  Clock,
  Star,
  Search,
} from "lucide-react"

export default function ServicesPage() {
  const [currentAQI, setCurrentAQI] = useState(89)
  const [aqiStatus, setAqiStatus] = useState("Moderate")
  const [pollutants, setPollutants] = useState({ pm25: 45, pm10: 78, ozone: 32 })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArea, setSelectedArea] = useState("all")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [aqiLocations, setAqiLocations] = useState([
    { area: "Bandra", aqi: 0, status: "Loading...", trend: "stable", lat: 19.0596, lon: 72.8295 },
    { area: "Andheri", aqi: 0, status: "Loading...", trend: "stable", lat: 19.1136, lon: 72.8697 },
    { area: "Colaba", aqi: 0, status: "Loading...", trend: "stable", lat: 18.9067, lon: 72.8147 },
    { area: "Powai", aqi: 0, status: "Loading...", trend: "stable", lat: 19.1176, lon: 72.9060 },
    { area: "Thane", aqi: 0, status: "Loading...", trend: "stable", lat: 19.2183, lon: 72.9781 },
    { area: "Navi Mumbai", aqi: 0, status: "Loading...", trend: "stable", lat: 19.0330, lon: 73.0297 },
  ])

  const getAqiStatus = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive"
    return "Unhealthy"
  }

  useEffect(() => {
    const fetchAllAqi = async () => {
      try {
        // Fetch Mumbai central AQI
        const response = await fetch(
          "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=19.076&longitude=72.8777&current=us_aqi,pm10,pm2_5,ozone"
        )
        if (response.ok) {
          const data = await response.json()
          const nextAqi = Number(data?.current?.us_aqi)
          const nextPm10 = Number(data?.current?.pm10)
          const nextPm25 = Number(data?.current?.pm2_5)
          const nextOzone = Number(data?.current?.ozone)

          if (!Number.isNaN(nextAqi)) {
            setCurrentAQI(nextAqi)
            setAqiStatus(getAqiStatus(nextAqi))
          }

          setPollutants((prev) => ({
            pm10: Number.isNaN(nextPm10) ? prev.pm10 : Math.round(nextPm10),
            pm25: Number.isNaN(nextPm25) ? prev.pm25 : Math.round(nextPm25),
            ozone: Number.isNaN(nextOzone) ? prev.ozone : Math.round(nextOzone),
          }))
        }

        // Fetch AQI for all locations
        const locationPromises = aqiLocations.map(async (location) => {
          try {
            const res = await fetch(
              `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=us_aqi`
            )
            if (res.ok) {
              const data = await res.json()
              const aqi = Number(data?.current?.us_aqi)
              if (!Number.isNaN(aqi)) {
                return { ...location, aqi, status: getAqiStatus(aqi) }
              }
            }
            return location
          } catch {
            return location
          }
        })

        const updatedLocations = await Promise.all(locationPromises)

        // Calculate trends by comparing with previous values
        setAqiLocations((prev) =>
          updatedLocations.map((loc, i) => ({
            ...loc,
            trend: loc.aqi > prev[i].aqi ? "worsening" : loc.aqi < prev[i].aqi ? "improving" : "stable"
          }))
        )

        setLastUpdated(new Date())
      } catch {
        // Silently fail
      }
    }

    fetchAllAqi()
    // Update every 30 seconds for real-time feel
    const interval = setInterval(fetchAllAqi, 30000)
    return () => clearInterval(interval)
  }, [])

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return { bg: "bg-green-500", text: "text-green-700", border: "border-green-200" }
    if (aqi <= 100) return { bg: "bg-yellow-500", text: "text-yellow-700", border: "border-yellow-200" }
    if (aqi <= 150) return { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-200" }
    return { bg: "bg-red-500", text: "text-red-700", border: "border-red-200" }
  }

  const aqiColor = getAQIColor(currentAQI)

  const recyclingCenters = [
    {
      name: "Eco Recycling Ltd",
      type: "E-Waste & General Recycling",
      address: "The Summit Business Bay, Andheri East, Mumbai - 400069",
      phone: "+91 22 6128 4000",
      hours: "9:00 AM - 6:00 PM",
      rating: 4.6,
      distance: "4.2 km",
      accepts: ["Computers", "Phones", "Batteries", "Electronics", "Plastic"],
      area: "andheri",
      mapUrl: "https://maps.google.com/?q=Eco+Recycling+Ltd+Andheri+Mumbai"
    },
    {
      name: "Neem Enviro - Kurla",
      type: "Biodegradable Waste",
      address: "Kurla West, Mumbai - 400070",
      phone: "+91 98200 12345",
      hours: "8:00 AM - 7:00 PM",
      rating: 4.5,
      distance: "2.3 km",
      accepts: ["Food Waste", "Garden Waste", "Organic Waste", "Compostables"],
      area: "kurla",
      mapUrl: "https://maps.google.com/?q=Neem+Enviro+Kurla+Mumbai"
    },
    {
      name: "Greennirman Recycling Pvt Ltd",
      type: "Industrial Recycling",
      address: "TTC MIDC Industrial Area, Mahape, Navi Mumbai - 400710",
      phone: "+91 22 2778 1234",
      hours: "9:00 AM - 5:30 PM",
      rating: 4.4,
      distance: "15.2 km",
      accepts: ["Industrial Waste", "Plastic", "Metal", "Paper"],
      area: "navi-mumbai",
      mapUrl: "https://maps.google.com/?q=Greennirman+Recycling+Navi+Mumbai"
    },
    {
      name: "SKV E-Waste Recycling Pvt Ltd",
      type: "Electronic Waste",
      address: "Andheri West, Mumbai - 400053",
      phone: "+91 22 2636 5000",
      hours: "10:00 AM - 6:00 PM",
      rating: 4.7,
      distance: "5.1 km",
      accepts: ["Laptops", "Mobiles", "Printers", "Cables", "Batteries"],
      area: "andheri",
      mapUrl: "https://maps.google.com/?q=SKV+E-Waste+Recycling+Andheri+Mumbai"
    },
    {
      name: "Clean E-Waste Recycling",
      type: "E-Waste Collection",
      address: "Andheri East, Mumbai - 400069",
      phone: "+91 98765 11223",
      hours: "9:30 AM - 6:30 PM",
      rating: 4.3,
      distance: "4.5 km",
      accepts: ["Computers", "Monitors", "Keyboards", "Electronics"],
      area: "andheri",
      mapUrl: "https://maps.google.com/?q=Clean+E-Waste+Recycling+Andheri+Mumbai"
    },
    {
      name: "Kohinoor E-Waste Recycling Pvt Ltd",
      type: "Scrap & E-Waste",
      address: "Dadar West, Mumbai - 400028",
      phone: "+91 22 2432 5678",
      hours: "9:00 AM - 7:00 PM",
      rating: 4.5,
      distance: "6.8 km",
      accepts: ["Ferrous Scrap", "Non-Ferrous", "E-Waste", "Copper", "Aluminum"],
      area: "dadar",
      mapUrl: "https://maps.google.com/?q=Kohinoor+E-Waste+Dadar+Mumbai"
    },
    {
      name: "ReCircle - Sustainable Solutions",
      type: "Plastic & Textile Recycling",
      address: "Bandra Kurla Complex, Mumbai - 400051",
      phone: "+91 22 6789 1234",
      hours: "10:00 AM - 6:00 PM",
      rating: 4.8,
      distance: "3.5 km",
      accepts: ["Plastic", "Textiles", "Packaging", "PET Bottles"],
      area: "bandra",
      mapUrl: "https://maps.google.com/?q=ReCircle+BKC+Mumbai"
    },
    {
      name: "Sampurn Environment Solutions",
      type: "Complete Waste Management",
      address: "Chembur East, Mumbai - 400071",
      phone: "+91 22 2529 4567",
      hours: "8:00 AM - 8:00 PM",
      rating: 4.4,
      distance: "7.2 km",
      accepts: ["All Waste Types", "Hazardous", "Medical", "Electronic"],
      area: "chembur",
      mapUrl: "https://maps.google.com/?q=Sampurn+Environment+Chembur+Mumbai"
    },
  ]

  const filteredCenters = recyclingCenters.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.accepts.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesArea = selectedArea === "all" || center.area === selectedArea
    return matchesSearch && matchesArea
  })

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
            <h1 className="text-4xl font-bold text-gray-900 font-serif">Local Services</h1>
            <p className="text-gray-600 mt-2">Air quality monitoring and recycling centers in Mumbai</p>
          </div>
        </div>

        <Tabs defaultValue="air-quality" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="air-quality" className="gap-2">
              <Wind className="h-4 w-4" />
              Air Quality Monitor
            </TabsTrigger>
            <TabsTrigger value="recycling" className="gap-2">
              <Recycle className="h-4 w-4" />
              Recycling Locator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="air-quality" className="space-y-6">
            {/* Current AQI Card */}
            <Card className={`${aqiColor.border} border-2`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <Wind className="h-5 w-5" />
                  Mumbai Air Quality Index
                  <span className="ml-2 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-green-600 font-normal">LIVE</span>
                  </span>
                </CardTitle>
                <CardDescription>Real-time air quality data updated every 30 seconds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-5xl font-bold font-mono mb-2">{currentAQI}</div>
                    <Badge className={`${aqiColor.bg} text-white`}>{aqiStatus}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Last Updated</div>
                    <div className="text-sm font-mono">{lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800 font-mono">PM2.5</div>
                    <div className="text-sm text-gray-600">{pollutants.pm25} μg/m³</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800 font-mono">PM10</div>
                    <div className="text-sm text-gray-600">{pollutants.pm10} μg/m³</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-800 font-mono">O₃</div>
                    <div className="text-sm text-gray-600">{pollutants.ozone} μg/m³</div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${aqiColor.border.replace("border", "bg").replace("200", "50")}`}>
                  <h4 className="font-semibold mb-2 font-serif">Health Recommendations</h4>
                  <p className="text-sm leading-relaxed">
                    {currentAQI <= 50 && "Air quality is good. Perfect for outdoor activities and exercise."}
                    {currentAQI > 50 &&
                      currentAQI <= 100 &&
                      "Air quality is moderate. Sensitive individuals should consider limiting prolonged outdoor activities."}
                    {currentAQI > 100 &&
                      currentAQI <= 150 &&
                      "Unhealthy for sensitive groups. Children, elderly, and people with respiratory conditions should limit outdoor activities."}
                    {currentAQI > 150 &&
                      "Air quality is unhealthy. Everyone should avoid prolonged outdoor activities."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Area-wise AQI */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Area-wise Air Quality</CardTitle>
                <CardDescription>AQI levels across different areas in Mumbai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aqiLocations.map((location, index) => {
                    const locationColor = getAQIColor(location.aqi)
                    return (
                      <div key={index} className={`p-4 rounded-lg border ${locationColor.border}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold font-serif">{location.area}</h4>
                          <Badge className={`${locationColor.bg} text-white text-xs`}>{location.status}</Badge>
                        </div>
                        <div className="text-2xl font-bold font-mono mb-2">{location.aqi}</div>
                        <div className="flex items-center gap-1 text-sm">
                          {location.trend === "improving" && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {location.trend === "worsening" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          {location.trend === "stable" && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                          <span className="capitalize text-gray-600">{location.trend}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recycling" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Find Recycling Centers</CardTitle>
                <CardDescription>Locate nearby recycling facilities in Mumbai</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name, type, or material..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Areas</SelectItem>
                      <SelectItem value="andheri">Andheri</SelectItem>
                      <SelectItem value="bandra">Bandra / BKC</SelectItem>
                      <SelectItem value="chembur">Chembur</SelectItem>
                      <SelectItem value="dadar">Dadar</SelectItem>
                      <SelectItem value="kurla">Kurla</SelectItem>
                      <SelectItem value="navi-mumbai">Navi Mumbai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Recycling Centers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCenters.map((center, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="font-serif">{center.name}</CardTitle>
                        <CardDescription>{center.type}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-mono">{center.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-sm">{center.address}</div>
                        <div className="text-xs text-green-600 font-mono">{center.distance} away</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-mono">{center.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{center.hours}</span>
                    </div>

                    <div>
                      <div className="text-sm font-semibold mb-2">Accepts:</div>
                      <div className="flex flex-wrap gap-1">
                        {center.accepts.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                        <Navigation className="h-4 w-4 mr-1" />
                        Get Directions
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCenters.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Recycle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2 font-serif">No centers found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or area selection.</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Tips */}
            <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
              <CardHeader>
                <CardTitle className="font-serif">Recycling Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Before You Go:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Clean containers thoroughly</li>
                      <li>• Remove labels and caps</li>
                      <li>• Sort materials by type</li>
                      <li>• Call ahead to confirm acceptance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What to Bring:</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Valid ID for e-waste</li>
                      <li>• Separate bags for different materials</li>
                      <li>• Receipt for tax benefits</li>
                      <li>• Reusable bags for transport</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
