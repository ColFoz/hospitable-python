"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { Building2, Calendar, MessageSquare, Star } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [token, setToken] = useState("")
  const [stats, setStats] = useState({
    properties: 0,
    reservations: 0,
    messages: 0,
    reviews: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = api.getToken()
    if (savedToken) {
      setIsAuthenticated(true)
      loadDashboardData()
    } else {
      setLoading(false)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [properties] = await Promise.all([
        api.listProperties({ per_page: 100 }),
      ])
      
      setStats({
        properties: properties.data?.length || 0,
        reservations: 0,
        messages: 0,
        reviews: 0,
      })
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      api.setToken(token)
      await api.getUser()
      setIsAuthenticated(true)
      await loadDashboardData()
    } catch (error) {
      alert("Authentication failed. Please check your token.")
      api.clearToken()
    }
  }

  const handleLogout = () => {
    api.clearToken()
    setIsAuthenticated(false)
    setToken("")
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome to Hospitable Dashboard</CardTitle>
            <CardDescription>
              Enter your Hospitable API token to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Hospitable API Token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-xs text-muted-foreground">
                Get your token from{" "}
                <a
                  href="https://my.hospitable.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  my.hospitable.com
                </a>{" "}
                → Apps → API access → Access tokens
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.properties}</div>
                  <p className="text-xs text-muted-foreground">Active listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reservations}</div>
                  <p className="text-xs text-muted-foreground">Upcoming bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.messages}</div>
                  <p className="text-xs text-muted-foreground">Unread messages</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.reviews}</div>
                  <p className="text-xs text-muted-foreground">Total reviews</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button onClick={() => router.push("/properties")}>
                  View Properties
                </Button>
                <Button variant="outline" onClick={() => router.push("/reservations")}>
                  Manage Reservations
                </Button>
                <Button variant="outline" onClick={() => router.push("/messages")}>
                  Check Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
