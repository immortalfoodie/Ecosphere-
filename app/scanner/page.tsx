"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Scan,
  Camera,
  Leaf,
  CheckCircle,
  Star,
  ArrowLeft,
  Search,
  BarChart3,
  Recycle,
  Factory,
  Truck,
  Award,
  X,
  AlertTriangle,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useEcosphere } from "@/components/ecosphere-provider"
import dynamic from "next/dynamic"

// Dynamically import the scanner to avoid SSR issues
const BarcodeScannerComponent = dynamic(() => import("react-qr-barcode-scanner"), { ssr: false })

type Product = {
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
  isEstimate?: boolean
}

// Keyword-based eco scoring for fallback
const ecoKeywords = {
  high: ["organic", "natural", "eco", "sustainable", "biodegradable", "recycled", "fair trade", "local", "vegan", "plant-based", "green", "renewable"],
  medium: ["recyclable", "reduced", "light", "fresh", "whole", "pure", "simple"],
  low: ["plastic", "disposable", "single-use", "artificial", "synthetic", "processed", "chemical"]
}

const categoryData: Record<string, { carbonRange: [number, number], waterRange: [number, number], recyclable: boolean }> = {
  beverage: { carbonRange: [0.3, 0.8], waterRange: [50, 200], recyclable: true },
  snack: { carbonRange: [0.5, 1.5], waterRange: [100, 400], recyclable: true },
  dairy: { carbonRange: [1.0, 3.0], waterRange: [500, 1500], recyclable: true },
  meat: { carbonRange: [5.0, 20.0], waterRange: [2000, 8000], recyclable: false },
  produce: { carbonRange: [0.1, 0.5], waterRange: [20, 100], recyclable: false },
  bakery: { carbonRange: [0.3, 1.0], waterRange: [100, 500], recyclable: true },
  frozen: { carbonRange: [0.8, 2.0], waterRange: [200, 800], recyclable: true },
  personal_care: { carbonRange: [0.5, 2.0], waterRange: [100, 500], recyclable: false },
  cleaning: { carbonRange: [0.4, 1.5], waterRange: [100, 400], recyclable: true },
  default: { carbonRange: [0.5, 1.5], waterRange: [100, 500], recyclable: true }
}

function analyzeKeywords(text: string): { score: number; positiveMatches: string[]; negativeMatches: string[] } {
  const lowerText = text.toLowerCase()
  let score = 50 // Start with neutral score
  const positiveMatches: string[] = []
  const negativeMatches: string[] = []

  ecoKeywords.high.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 10
      positiveMatches.push(keyword)
    }
  })

  ecoKeywords.medium.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score += 5
      positiveMatches.push(keyword)
    }
  })

  ecoKeywords.low.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      score -= 10
      negativeMatches.push(keyword)
    }
  })

  return { score: Math.max(10, Math.min(95, score)), positiveMatches, negativeMatches }
}

function detectCategory(text: string): string {
  const lowerText = text.toLowerCase()
  if (lowerText.match(/soda|cola|juice|water|drink|beverage|tea|coffee/)) return "beverage"
  if (lowerText.match(/chip|snack|cookie|biscuit|cracker|candy|chocolate/)) return "snack"
  if (lowerText.match(/milk|cheese|yogurt|butter|cream|dairy/)) return "dairy"
  if (lowerText.match(/meat|chicken|beef|pork|fish|seafood/)) return "meat"
  if (lowerText.match(/fruit|vegetable|produce|fresh|organic/)) return "produce"
  if (lowerText.match(/bread|cake|pastry|bakery/)) return "bakery"
  if (lowerText.match(/frozen|ice cream/)) return "frozen"
  if (lowerText.match(/shampoo|soap|lotion|cosmetic|personal/)) return "personal_care"
  if (lowerText.match(/cleaner|detergent|cleaning/)) return "cleaning"
  return "default"
}

async function fetchProductFromAPI(barcode: string): Promise<Product | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
    const data = await response.json()

    if (data.status === 1 && data.product) {
      const product = data.product
      const name = product.product_name || product.product_name_en || "Unknown Product"
      const brand = product.brands || "Unknown Brand"
      const categories = product.categories || ""
      const packaging = product.packaging || ""

      // Analyze text for eco scoring
      const combinedText = `${name} ${brand} ${categories} ${packaging}`
      const analysis = analyzeKeywords(combinedText)
      const category = detectCategory(combinedText)
      const catData = categoryData[category] || categoryData.default

      // Generate approximate data
      const carbonValue = (catData.carbonRange[0] + catData.carbonRange[1]) / 2
      const waterValue = Math.round((catData.waterRange[0] + catData.waterRange[1]) / 2)

      // Determine recyclability from packaging
      const isRecyclable = packaging.toLowerCase().includes("recyclable") ||
        packaging.toLowerCase().includes("glass") ||
        packaging.toLowerCase().includes("aluminium") ||
        packaging.toLowerCase().includes("cardboard") ||
        catData.recyclable

      // Generate alternatives based on category
      const alternatives = generateAlternatives(category, name)

      return {
        id: `api-${barcode}`,
        name,
        brand,
        barcode,
        ecoScore: analysis.score,
        carbonFootprint: `${carbonValue.toFixed(1)} kg CO₂`,
        waterUsage: `${waterValue} L`,
        recyclable: isRecyclable,
        certifications: analysis.positiveMatches.slice(0, 3).map(m => m.charAt(0).toUpperCase() + m.slice(1)),
        description: `Product data estimated from ${categories || 'general'} category. ${analysis.positiveMatches.length > 0 ? `Positive: ${analysis.positiveMatches.join(', ')}` : ''} ${analysis.negativeMatches.length > 0 ? `Concerns: ${analysis.negativeMatches.join(', ')}` : ''}`.trim(),
        alternatives,
        isEstimate: true
      }
    }
    return null
  } catch (error) {
    console.error("API fetch error:", error)
    return null
  }
}

function generateAlternatives(category: string, productName: string): string[] {
  const alternatives: Record<string, string[]> = {
    beverage: ["Reusable water bottle", "Local tap water", "Glass bottle drinks"],
    snack: ["Homemade snacks", "Bulk store options", "Local bakery items"],
    dairy: ["Plant-based alternatives", "Local dairy products", "Organic options"],
    meat: ["Plant-based proteins", "Local/organic meat", "Legumes and beans"],
    produce: ["Local farmers market", "Seasonal produce", "Home grown options"],
    bakery: ["Local bakery", "Homemade bread", "Whole grain options"],
    frozen: ["Fresh alternatives", "Bulk cooking", "Local options"],
    personal_care: ["Refillable products", "Bar soaps/shampoos", "Natural alternatives"],
    cleaning: ["DIY cleaners", "Concentrated products", "Refillable options"],
    default: ["Local alternatives", "Package-free options", "Sustainable brands"]
  }
  return alternatives[category] || alternatives.default
}

export default function ProductScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCamera, setShowCamera] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { state, recordScan } = useEcosphere()
  const products = state.scannerProducts

  const handleScan = async (err: any, result: any) => {
    if (result) {
      const barcode = result.text
      setIsLoading(true)
      setScanError(null)

      // First check local database
      const product = products.find((p) => p.barcode === barcode)

      if (product) {
        setScannedProduct(product)
        recordScan(product.id)
        setShowCamera(false)
        setIsLoading(false)
      } else {
        // Try to fetch from API and generate estimate
        const apiProduct = await fetchProductFromAPI(barcode)
        setShowCamera(false)
        setIsLoading(false)

        if (apiProduct) {
          setScannedProduct(apiProduct)
        } else {
          setScanError(`Barcode ${barcode} not found. Try searching by product name.`)
        }
      }
    }

    if (err) {
      console.error(err)
    }
  }

  const handleSearch = async () => {
    if (searchQuery) {
      const query = searchQuery.trim().toLowerCase()
      setIsLoading(true)
      setScanError(null)

      // First check local database
      const product = products.find(
        (p) => p.name.toLowerCase().includes(query) || p.barcode.toLowerCase() === query
      )

      if (product) {
        setScannedProduct(product)
        recordScan(product.id)
        setIsLoading(false)
      } else {
        // If query looks like a barcode, try API
        if (/^\d{8,13}$/.test(query)) {
          const apiProduct = await fetchProductFromAPI(query)
          if (apiProduct) {
            setScannedProduct(apiProduct)
            setIsLoading(false)
            return
          }
        }
        setIsLoading(false)
        setScanError(`No product found for "${searchQuery}". Try a different search term.`)
      }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const }
    if (score >= 60) return { label: "Good", variant: "secondary" as const }
    return { label: "Poor", variant: "destructive" as const }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Scan className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Product Scanner</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Scanner Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan or Search Product
            </CardTitle>
            <CardDescription>Scan a barcode or search for a product to view its environmental impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search product name or enter barcode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-center space-y-2">
              <Button onClick={() => setShowCamera(true)} size="lg" className="w-full max-w-xs">
                <Camera className="h-5 w-5 mr-2" />
                Start Camera Scan
              </Button>
              {scanError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{scanError}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Scan Barcode</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCamera(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <BarcodeScannerComponent
                    onUpdate={handleScan}
                    width="100%"
                    height="100%"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Hold a barcode in front of your camera. Supported formats: EAN-13, UPC-A, QR codes
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-blue-700">Searching for product data...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Results */}
        {scannedProduct && (
          <div className="space-y-6">
            {/* Estimated Data Warning */}
            {scannedProduct.isEstimate && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Estimated Data</p>
                  <p className="text-sm text-amber-700">
                    This product wasn't in our verified database. The eco-score and environmental data are estimated based on product category and keywords. Actual values may vary.
                  </p>
                </div>
              </div>
            )}

            {/* Product Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{scannedProduct.name}</CardTitle>
                      {scannedProduct.isEstimate && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                          Estimated
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-lg">{scannedProduct.brand}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(scannedProduct.ecoScore)}`}>
                      {scannedProduct.ecoScore}/100
                    </div>
                    <Badge {...getScoreBadge(scannedProduct.ecoScore)}>
                      {getScoreBadge(scannedProduct.ecoScore).label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{scannedProduct.description}</p>
                <div className="flex flex-wrap gap-2">
                  {scannedProduct.certifications.map((cert: string) => (
                    <Badge key={cert} variant="outline" className="flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                  {scannedProduct.recyclable && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Recycle className="h-3 w-3" />
                      Recyclable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Factory className="h-5 w-5 text-red-500" />
                    Carbon Footprint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500 mb-2">{scannedProduct.carbonFootprint}</div>
                  <Progress value={scannedProduct.ecoScore} className="mb-2" />
                  <p className="text-sm text-muted-foreground">Manufacturing to disposal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-500" />
                    Water Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500 mb-2">{scannedProduct.waterUsage}</div>
                  <Progress value={scannedProduct.ecoScore} className="mb-2" />
                  <p className="text-sm text-muted-foreground">Production process</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Eco Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(scannedProduct.ecoScore)}`}>
                    {scannedProduct.ecoScore}/100
                  </div>
                  <Progress value={scannedProduct.ecoScore} className="mb-2" />
                  <p className="text-sm text-muted-foreground">Overall sustainability</p>
                </CardContent>
              </Card>
            </div>

            {/* Alternatives */}
            {scannedProduct.alternatives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Eco-Friendly Alternatives
                  </CardTitle>
                  <CardDescription>Consider these more sustainable options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {scannedProduct.alternatives.map((alt: string, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{alt}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Better environmental impact</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1">
                <Star className="h-4 w-4 mr-2" />
                Save to Favorites
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Share Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
