"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calculator, Trash2, Car, Target, TrendingDown, Award, Info, Zap, Utensils, Fuel } from "lucide-react"
import { useEcosphere } from "@/components/ecosphere-provider"

// ============================================================================
// REAL EMISSION FACTORS - Based on scientific data sources
// ============================================================================

// India's power grid emission factor (CEA India 2023) - kg CO₂ per kWh
const ELECTRICITY_EMISSION_FACTOR = 0.82 // kg CO₂/kWh

// Transport emission factors (IPCC, Indian Railways, IOCL data) - kg CO₂ per km
const TRANSPORT_EMISSION_FACTORS = {
  petrolCar: 0.192,      // Average petrol car (150g CO₂/km = 0.15 + fuel production ~28%)
  dieselCar: 0.171,      // Average diesel car (more efficient engine)
  cngCar: 0.129,         // CNG vehicle (cleaner than petrol)
  electricCar: 0.053,    // EV with Indian grid electricity
  motorcycle: 0.103,     // Two-wheeler petrol
  electricScooter: 0.022, // Electric two-wheeler
  autoRickshaw: 0.091,   // CNG auto-rickshaw per passenger
  bus: 0.089,            // State transport bus per passenger-km
  metro: 0.035,          // Delhi/Mumbai Metro per passenger-km
  localTrain: 0.041,     // Mumbai Local per passenger-km
  taxi: 0.210,           // Ola/Uber (includes empty return trips)
  walking: 0,            // Zero emissions
  cycling: 0,            // Zero emissions
} as const

// Food emission factors (FAO, Our World in Data) - kg CO₂ per day
const FOOD_EMISSION_FACTORS = {
  vegan: 1.5,              // Plant-based only
  vegetarian: 2.5,         // Includes dairy
  pescatarian: 3.2,        // Fish + vegetarian
  mixedLowMeat: 4.0,       // Occasional non-veg (1-2 times/week)
  mixedMediumMeat: 5.5,    // Regular non-veg (3-4 times/week)
  mixedHighMeat: 7.0,      // Daily non-veg
  heavyBeef: 9.0,          // Daily beef consumption
} as const

// Waste emission factors (CPCB India, EPA) - kg CO₂ per kg waste
const WASTE_EMISSION_FACTORS = {
  landfill: 0.58,          // Mixed waste to landfill
  composted: 0.1,          // Organic waste composted
  recycledPlastic: 0.21,   // Recycled plastic
  recycledPaper: 0.15,     // Recycled paper
  recycledMetal: 0.12,     // Recycled metal
  burned: 0.94,            // Open burning
  eWasteRecycled: 0.35,    // E-waste properly recycled
  eWasteImproper: 1.2,     // E-waste improper disposal
} as const

// Average Indian benchmarks for comparison
const INDIA_BENCHMARKS = {
  dailyElectricity: 4.5,    // kWh per person per day (urban)
  dailyTransport: 8,        // km per person per day
  dailyWaste: 0.5,          // kg per person per day
  targetDailyCarbon: 8,     // kg CO₂ per day for sustainable living
  averageDailyCarbon: 12,   // Average urban Indian
}

export default function TrackerPage() {
  const { state, saveTrackerSnapshot } = useEcosphere()

  // Raw input values (before emission calculations)
  const [electricityKwh, setElectricityKwh] = useState(0)
  const [vehicleType, setVehicleType] = useState<keyof typeof TRANSPORT_EMISSION_FACTORS>('petrolCar')
  const [kmDriven, setKmDriven] = useState(0)
  const [dietType, setDietType] = useState<keyof typeof FOOD_EMISSION_FACTORS>('vegetarian')
  const [wasteKg, setWasteKg] = useState(0)
  const [wasteDisposal, setWasteDisposal] = useState<keyof typeof WASTE_EMISSION_FACTORS>('landfill')

  // Calculated carbon values
  const [carbonData, setCarbonData] = useState({
    electricity: 0,
    transport: 0,
    food: 0,
    waste: 0,
  })

  const [wasteData, setWasteData] = useState({
    plastic: 0,
    organic: 0,
    paper: 0,
    electronic: 0,
  })

  const [transportData, setTransportData] = useState({
    walking: 0,
    cycling: 0,
    publicTransport: 0,
    car: 0,
  })

  const [streak, setStreak] = useState(state.user.currentStreak)

  useEffect(() => {
    if (state.trackerSnapshots.length > 0) {
      const latest = state.trackerSnapshots[0]
      setCarbonData(latest.carbonData)
      setWasteData(latest.wasteData)
      setTransportData(latest.transportData)
    }
  }, [state.trackerSnapshots])

  useEffect(() => {
    setStreak(state.user.currentStreak)
  }, [state.user.currentStreak])

  const handleSaveSnapshot = () => {
    saveTrackerSnapshot({
      carbonData,
      wasteData,
      transportData,
    })
  }

  // Real-time carbon calculation based on inputs
  useEffect(() => {
    const electricityCarbon = electricityKwh * ELECTRICITY_EMISSION_FACTOR
    const transportCarbon = kmDriven * TRANSPORT_EMISSION_FACTORS[vehicleType]
    const foodCarbon = FOOD_EMISSION_FACTORS[dietType]
    const wasteCarbon = wasteKg * WASTE_EMISSION_FACTORS[wasteDisposal]

    setCarbonData({
      electricity: Math.round(electricityCarbon * 100) / 100,
      transport: Math.round(transportCarbon * 100) / 100,
      food: Math.round(foodCarbon * 100) / 100,
      waste: Math.round(wasteCarbon * 100) / 100,
    })
  }, [electricityKwh, kmDriven, vehicleType, dietType, wasteKg, wasteDisposal])

  const totalCarbon = Object.values(carbonData).reduce((sum, val) => sum + val, 0)
  const totalWaste = Object.values(wasteData).reduce((sum, val) => sum + val, 0)
  const greenTransport = transportData.walking + transportData.cycling + transportData.publicTransport
  const totalTransport = Object.values(transportData).reduce((sum, val) => sum + val, 0)
  const greenPercentage = totalTransport > 0 ? Math.round((greenTransport / totalTransport) * 100) : 0

  // Carbon level thresholds based on sustainable living targets
  const getCarbonLevel = (carbon: number) => {
    if (carbon <= INDIA_BENCHMARKS.targetDailyCarbon)
      return { level: "Excellent - Sustainable", color: "bg-green-500", text: "text-green-700", description: "Below sustainable target" }
    if (carbon <= INDIA_BENCHMARKS.averageDailyCarbon)
      return { level: "Good - Below Average", color: "bg-yellow-500", text: "text-yellow-700", description: "Better than average Indian" }
    if (carbon <= 20)
      return { level: "Moderate", color: "bg-orange-500", text: "text-orange-700", description: "Above average, room for improvement" }
    return { level: "High - Needs Action", color: "bg-red-500", text: "text-red-700", description: "Significantly above sustainable levels" }
  }

  const carbonLevel = getCarbonLevel(totalCarbon)
  const sustainabilityScore = Math.max(0, Math.min(100, Math.round((1 - totalCarbon / 25) * 100)))

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
            <h1 className="text-4xl font-bold text-gray-900 font-serif">EcoTracker</h1>
            <p className="text-gray-600 mt-2">Monitor your environmental impact daily</p>
          </div>
        </div>

        {/* Streak & Goals Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Award className="h-5 w-5" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 font-mono">{streak} days</div>
              <p className="text-sm text-orange-700 mt-1">Keep tracking daily!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Target className="h-5 w-5" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 font-mono">{greenPercentage}%</div>
              <Progress value={greenPercentage} className="mt-2" />
              <p className="text-sm text-green-700 mt-1">Green transport usage</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <TrendingDown className="h-5 w-5" />
                Carbon Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={`${carbonLevel.color} text-white mb-2`}>{carbonLevel.level}</Badge>
              <div className="text-2xl font-bold text-blue-900 font-mono">{totalCarbon.toFixed(1)} kg CO₂</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="carbon" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carbon" className="gap-2">
              <Calculator className="h-4 w-4" />
              Carbon Calculator
            </TabsTrigger>
            <TabsTrigger value="waste" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Waste Tracker
            </TabsTrigger>
            <TabsTrigger value="transport" className="gap-2">
              <Car className="h-4 w-4" />
              Transport Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carbon" className="space-y-6">
            {/* Emission Factor Info Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-800 text-sm">
                  <Info className="h-4 w-4" />
                  Using Real Emission Factors for India
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-2 bg-white/60 rounded">
                    <div className="font-semibold text-blue-900 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Electricity
                    </div>
                    <div className="text-blue-700">{ELECTRICITY_EMISSION_FACTOR} kg CO₂/kWh</div>
                    <div className="text-blue-500">CEA India Grid 2023</div>
                  </div>
                  <div className="p-2 bg-white/60 rounded">
                    <div className="font-semibold text-blue-900 flex items-center gap-1">
                      <Fuel className="h-3 w-3" /> Petrol Car
                    </div>
                    <div className="text-blue-700">{TRANSPORT_EMISSION_FACTORS.petrolCar} kg CO₂/km</div>
                    <div className="text-blue-500">IPCC + IOCL Data</div>
                  </div>
                  <div className="p-2 bg-white/60 rounded">
                    <div className="font-semibold text-blue-900 flex items-center gap-1">
                      <Utensils className="h-3 w-3" /> Veg Diet
                    </div>
                    <div className="text-blue-700">{FOOD_EMISSION_FACTORS.vegetarian} kg CO₂/day</div>
                    <div className="text-blue-500">FAO Data</div>
                  </div>
                  <div className="p-2 bg-white/60 rounded">
                    <div className="font-semibold text-blue-900 flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Waste
                    </div>
                    <div className="text-blue-700">{WASTE_EMISSION_FACTORS.landfill} kg CO₂/kg</div>
                    <div className="text-blue-500">CPCB India</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Daily Carbon Footprint Calculator</CardTitle>
                <CardDescription>Track your daily activities using scientifically accurate emission factors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Electricity Input */}
                  <div className="space-y-2">
                    <Label htmlFor="electricity" className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      Electricity Usage (kWh)
                    </Label>
                    <Input
                      id="electricity"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 5"
                      value={electricityKwh || ""}
                      onChange={(e) => setElectricityKwh(Number.parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-600">
                      Avg urban Indian: {INDIA_BENCHMARKS.dailyElectricity} kWh/day •
                      <span className="text-blue-600 font-medium"> {ELECTRICITY_EMISSION_FACTOR} kg CO₂/kWh</span>
                    </p>
                  </div>

                  {/* Transport Section */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-blue-600" />
                      Vehicle Type
                    </Label>
                    <Select
                      value={vehicleType}
                      onValueChange={(value) => setVehicleType(value as keyof typeof TRANSPORT_EMISSION_FACTORS)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrolCar">🚗 Petrol Car ({TRANSPORT_EMISSION_FACTORS.petrolCar} kg/km)</SelectItem>
                        <SelectItem value="dieselCar">🚙 Diesel Car ({TRANSPORT_EMISSION_FACTORS.dieselCar} kg/km)</SelectItem>
                        <SelectItem value="cngCar">🚕 CNG Car ({TRANSPORT_EMISSION_FACTORS.cngCar} kg/km)</SelectItem>
                        <SelectItem value="electricCar">⚡ Electric Car ({TRANSPORT_EMISSION_FACTORS.electricCar} kg/km)</SelectItem>
                        <SelectItem value="motorcycle">🏍️ Motorcycle ({TRANSPORT_EMISSION_FACTORS.motorcycle} kg/km)</SelectItem>
                        <SelectItem value="electricScooter">🛵 Electric Scooter ({TRANSPORT_EMISSION_FACTORS.electricScooter} kg/km)</SelectItem>
                        <SelectItem value="autoRickshaw">🛺 Auto-Rickshaw ({TRANSPORT_EMISSION_FACTORS.autoRickshaw} kg/km)</SelectItem>
                        <SelectItem value="taxi">🚖 Taxi/Cab ({TRANSPORT_EMISSION_FACTORS.taxi} kg/km)</SelectItem>
                        <SelectItem value="bus">🚌 Bus ({TRANSPORT_EMISSION_FACTORS.bus} kg/km)</SelectItem>
                        <SelectItem value="metro">🚇 Metro ({TRANSPORT_EMISSION_FACTORS.metro} kg/km)</SelectItem>
                        <SelectItem value="localTrain">🚃 Local Train ({TRANSPORT_EMISSION_FACTORS.localTrain} kg/km)</SelectItem>
                        <SelectItem value="walking">🚶 Walking (0 kg/km)</SelectItem>
                        <SelectItem value="cycling">🚴 Cycling (0 kg/km)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="km-driven">Distance Traveled (km)</Label>
                    <Input
                      id="km-driven"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 10"
                      value={kmDriven || ""}
                      onChange={(e) => setKmDriven(Number.parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-600">
                      Emission: <span className="font-medium text-blue-600">{(kmDriven * TRANSPORT_EMISSION_FACTORS[vehicleType]).toFixed(2)} kg CO₂</span>
                    </p>
                  </div>

                  {/* Food Section */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-green-600" />
                      Today&apos;s Diet
                    </Label>
                    <Select
                      value={dietType}
                      onValueChange={(value) => setDietType(value as keyof typeof FOOD_EMISSION_FACTORS)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegan">🌱 Vegan ({FOOD_EMISSION_FACTORS.vegan} kg CO₂)</SelectItem>
                        <SelectItem value="vegetarian">🥗 Vegetarian ({FOOD_EMISSION_FACTORS.vegetarian} kg CO₂)</SelectItem>
                        <SelectItem value="pescatarian">🐟 Pescatarian ({FOOD_EMISSION_FACTORS.pescatarian} kg CO₂)</SelectItem>
                        <SelectItem value="mixedLowMeat">🍗 Low Meat (1-2x/week) ({FOOD_EMISSION_FACTORS.mixedLowMeat} kg CO₂)</SelectItem>
                        <SelectItem value="mixedMediumMeat">🥩 Medium Meat (3-4x/week) ({FOOD_EMISSION_FACTORS.mixedMediumMeat} kg CO₂)</SelectItem>
                        <SelectItem value="mixedHighMeat">🍖 High Meat (Daily) ({FOOD_EMISSION_FACTORS.mixedHighMeat} kg CO₂)</SelectItem>
                        <SelectItem value="heavyBeef">🥩 Heavy Beef Diet ({FOOD_EMISSION_FACTORS.heavyBeef} kg CO₂)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Waste Section */}
                  <div className="space-y-2">
                    <Label htmlFor="waste-kg" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-orange-600" />
                      Waste Generated (kg)
                    </Label>
                    <Input
                      id="waste-kg"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 0.5"
                      value={wasteKg || ""}
                      onChange={(e) => setWasteKg(Number.parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-sm text-gray-600">
                      Avg Indian: {INDIA_BENCHMARKS.dailyWaste} kg/day
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Waste Disposal Method</Label>
                    <Select
                      value={wasteDisposal}
                      onValueChange={(value) => setWasteDisposal(value as keyof typeof WASTE_EMISSION_FACTORS)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="How is waste disposed?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="landfill">🗑️ Landfill ({WASTE_EMISSION_FACTORS.landfill} kg CO₂/kg)</SelectItem>
                        <SelectItem value="composted">🌱 Composted ({WASTE_EMISSION_FACTORS.composted} kg CO₂/kg)</SelectItem>
                        <SelectItem value="recycledPlastic">♻️ Recycled Plastic ({WASTE_EMISSION_FACTORS.recycledPlastic} kg CO₂/kg)</SelectItem>
                        <SelectItem value="recycledPaper">📄 Recycled Paper ({WASTE_EMISSION_FACTORS.recycledPaper} kg CO₂/kg)</SelectItem>
                        <SelectItem value="burned">🔥 Open Burning ({WASTE_EMISSION_FACTORS.burned} kg CO₂/kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results Section */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg font-serif">Today&apos;s Carbon Footprint</h3>
                    <Badge className={`${carbonLevel.color} text-white`}>{carbonLevel.level}</Badge>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <div className="text-4xl font-bold text-gray-900 font-mono">{totalCarbon.toFixed(2)}</div>
                    <div className="text-lg text-gray-600">kg CO₂</div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Sustainability Score</span>
                      <span className="font-mono font-semibold">{sustainabilityScore}%</span>
                    </div>
                    <Progress value={sustainabilityScore} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
                      <div className="text-lg font-bold text-yellow-800 font-mono">{carbonData.electricity.toFixed(2)}</div>
                      <div className="text-xs text-yellow-600">Electricity</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Car className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                      <div className="text-lg font-bold text-blue-800 font-mono">{carbonData.transport.toFixed(2)}</div>
                      <div className="text-xs text-blue-600">Transport</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <Utensils className="h-4 w-4 mx-auto mb-1 text-green-600" />
                      <div className="text-lg font-bold text-green-800 font-mono">{carbonData.food.toFixed(2)}</div>
                      <div className="text-xs text-green-600">Food</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <Trash2 className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                      <div className="text-lg font-bold text-orange-800 font-mono">{carbonData.waste.toFixed(2)}</div>
                      <div className="text-xs text-orange-600">Waste</div>
                    </div>
                  </div>

                  {/* Comparison with benchmarks */}
                  <div className="bg-white/80 p-3 rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span>🎯 Sustainable target:</span>
                      <span className="font-mono">{INDIA_BENCHMARKS.targetDailyCarbon} kg CO₂/day</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>📊 Avg urban Indian:</span>
                      <span className="font-mono">{INDIA_BENCHMARKS.averageDailyCarbon} kg CO₂/day</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>📍 Your footprint:</span>
                      <span className={`font-mono ${totalCarbon <= INDIA_BENCHMARKS.targetDailyCarbon ? 'text-green-600' : totalCarbon <= INDIA_BENCHMARKS.averageDailyCarbon ? 'text-yellow-600' : 'text-red-600'}`}>
                        {totalCarbon.toFixed(2)} kg CO₂/day
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveSnapshot} className="w-full bg-green-600 hover:bg-green-700">
                  Save Today&apos;s Log
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waste" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Daily Waste Tracker</CardTitle>
                <CardDescription>Monitor and categorize your waste generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="plastic">Plastic Waste (grams)</Label>
                    <Input
                      id="plastic"
                      type="number"
                      placeholder="e.g., 150"
                      value={wasteData.plastic || ""}
                      onChange={(e) => setWasteData({ ...wasteData, plastic: Number.parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-sm text-gray-600">Bottles, bags, packaging</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organic">Organic Waste (grams)</Label>
                    <Input
                      id="organic"
                      type="number"
                      placeholder="e.g., 300"
                      value={wasteData.organic || ""}
                      onChange={(e) => setWasteData({ ...wasteData, organic: Number.parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-sm text-gray-600">Food scraps, vegetable peels</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paper">Paper Waste (grams)</Label>
                    <Input
                      id="paper"
                      type="number"
                      placeholder="e.g., 100"
                      value={wasteData.paper || ""}
                      onChange={(e) => setWasteData({ ...wasteData, paper: Number.parseFloat(e.target.value) || 0 })}
                    />
                    <p className="text-sm text-gray-600">Newspapers, cardboard, documents</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="electronic">E-Waste (grams)</Label>
                    <Input
                      id="electronic"
                      type="number"
                      placeholder="e.g., 50"
                      value={wasteData.electronic || ""}
                      onChange={(e) =>
                        setWasteData({ ...wasteData, electronic: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-sm text-gray-600">Batteries, cables, old devices</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 font-serif">Today&apos;s Waste Summary</h3>
                  <div className="text-3xl font-bold text-gray-900 font-mono">{totalWaste.toFixed(0)} grams</div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-red-100 rounded-lg">
                      <div className="text-lg font-bold text-red-800 font-mono">{wasteData.plastic}g</div>
                      <div className="text-sm text-red-600">Plastic</div>
                    </div>
                    <div className="text-center p-3 bg-green-100 rounded-lg">
                      <div className="text-lg font-bold text-green-800 font-mono">{wasteData.organic}g</div>
                      <div className="text-sm text-green-600">Organic</div>
                    </div>
                    <div className="text-center p-3 bg-blue-100 rounded-lg">
                      <div className="text-lg font-bold text-blue-800 font-mono">{wasteData.paper}g</div>
                      <div className="text-sm text-blue-600">Paper</div>
                    </div>
                    <div className="text-center p-3 bg-purple-100 rounded-lg">
                      <div className="text-lg font-bold text-purple-800 font-mono">{wasteData.electronic}g</div>
                      <div className="text-sm text-purple-600">E-Waste</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Goal:</strong> Reduce total waste by 20% this week. Current: {totalWaste.toFixed(0)}g
                    </p>
                  </div>
                </div>
                <Button onClick={handleSaveSnapshot} className="w-full">
                  Save Today&apos;s Log
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transport" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Green Transportation Log</CardTitle>
                <CardDescription>Track your daily commute and transportation choices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="walking">Walking (km)</Label>
                    <Input
                      id="walking"
                      type="number"
                      placeholder="e.g., 2.5"
                      value={transportData.walking || ""}
                      onChange={(e) =>
                        setTransportData({ ...transportData, walking: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-sm text-green-600">Zero emissions! 🚶‍♂️</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cycling">Cycling (km)</Label>
                    <Input
                      id="cycling"
                      type="number"
                      placeholder="e.g., 5"
                      value={transportData.cycling || ""}
                      onChange={(e) =>
                        setTransportData({ ...transportData, cycling: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-sm text-green-600">Zero emissions! 🚴‍♂️</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="public">Public Transport (km)</Label>
                    <Input
                      id="public"
                      type="number"
                      placeholder="e.g., 15"
                      value={transportData.publicTransport || ""}
                      onChange={(e) =>
                        setTransportData({ ...transportData, publicTransport: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-sm text-green-600">Mumbai Local, Bus, Metro</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="car-transport">Car/Taxi (km)</Label>
                    <Input
                      id="car-transport"
                      type="number"
                      placeholder="e.g., 10"
                      value={transportData.car || ""}
                      onChange={(e) =>
                        setTransportData({ ...transportData, car: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                    <p className="text-sm text-red-600">High emissions</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 font-serif">Today&apos;s Transport Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-700 font-mono">{greenTransport.toFixed(1)} km</div>
                      <div className="text-sm text-green-600">Green Transport</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-700 font-mono">{transportData.car.toFixed(1)} km</div>
                      <div className="text-sm text-red-600">Car/Taxi</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Green Transport Percentage</span>
                      <span className="font-mono">{greenPercentage}%</span>
                    </div>
                    <Progress value={greenPercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="text-center p-2 bg-green-100 rounded">
                      <div className="font-bold text-green-800 font-mono">{transportData.walking}km</div>
                      <div className="text-green-600">Walk</div>
                    </div>
                    <div className="text-center p-2 bg-green-100 rounded">
                      <div className="font-bold text-green-800 font-mono">{transportData.cycling}km</div>
                      <div className="text-green-600">Cycle</div>
                    </div>
                    <div className="text-center p-2 bg-blue-100 rounded">
                      <div className="font-bold text-blue-800 font-mono">{transportData.publicTransport}km</div>
                      <div className="text-blue-600">Public</div>
                    </div>
                    <div className="text-center p-2 bg-red-100 rounded">
                      <div className="font-bold text-red-800 font-mono">{transportData.car}km</div>
                      <div className="text-red-600">Car</div>
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveSnapshot} className="w-full">
                  Save Today&apos;s Log
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            Save Today&apos;s Data
          </Button>
          <p className="text-sm text-gray-600 mt-2">Keep tracking daily to maintain your streak and earn rewards!</p>
        </div>
      </div>
    </div>
  )
}
