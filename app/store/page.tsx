"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingBag, ArrowLeft, Search, Star, Heart, Leaf, Award, ShoppingCart, Truck } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useEcosphere } from "@/components/ecosphere-provider"

export default function EcoStore() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { state, addToCart, updateCartQuantity, removeFromCart, checkoutCart } = useEcosphere()
  const products = state.storeProducts
  const cart = state.cart

  const categories = [
    { id: "all", label: "All Products" },
    { id: "drinkware", label: "Drinkware" },
    { id: "bags", label: "Bags" },
    { id: "electronics", label: "Electronics" },
    { id: "accessories", label: "Accessories" },
    { id: "stationery", label: "Stationery" },
    { id: "home", label: "Home" },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const cartItems = cart
    .map((item) => {
      const product = products.find((productItem) => productItem.id === item.productId)
      if (!product) return null
      return {
        ...item,
        product,
        lineTotal: product.price * item.quantity,
      }
    })
    .filter(Boolean)

  const cartTotal = cartItems.reduce((sum, item) => sum + (item ? item.lineTotal : 0), 0)
  const cartPoints = cartItems.reduce((sum, item) => sum + (item ? item.product.pointsReward * item.quantity : 0), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const getEcoScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    return "text-orange-600"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Eco Bazaar India</h1>
            </div>
          </div>
          <Button variant="outline" className="relative bg-transparent">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Shop Sustainably, Support Indian NGOs</h2>
              <p className="text-muted-foreground mb-4">
                Every purchase supports environmental organizations across India and earns you eco-points
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span>Eco-Certified Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>NGO Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Earn Eco-Points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {cartItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Cart</CardTitle>
              <CardDescription>Review items before checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) =>
                  item ? (
                    <div key={item.productId} className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ₹{item.product.price.toLocaleString("en-IN")} · {item.product.pointsReward} points
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-6 text-center font-mono">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.productId)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-xl font-bold">₹{cartTotal.toLocaleString("en-IN")}</div>
                  <div className="text-sm text-muted-foreground">Earn {cartPoints} eco-points</div>
                </div>
                <Button onClick={checkoutCart}>Checkout</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search eco-friendly products made in India..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-red-500">-{product.discount}%</Badge>
                )}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}
                <Button variant="outline" size="sm" className="absolute top-2 right-2 h-8 w-8 p-0 bg-transparent">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                  <div className={`text-sm font-bold ${getEcoScoreColor(product.ecoScore)}`}>
                    {product.ecoScore}/100
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.certifications.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="secondary" className="text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">₹{product.price.toLocaleString("en-IN")}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>+{product.pointsReward} points</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>Supports {product.ngoSupport}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    <span>Free shipping on orders over ₹1,999</span>
                  </div>
                </div>

                <Button className="w-full" disabled={!product.inStock} onClick={() => addToCart(product.id)}>
                  {product.inStock ? (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
