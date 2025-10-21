"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [tokenInfo, setTokenInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const [userData, tokenData] = await Promise.all([
        api.getUser(),
        api.getTokenInfo(),
      ])
      setUser(userData)
      setTokenInfo(tokenData)
    } catch (error) {
      console.error("Failed to load settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    api.clearToken()
    window.location.href = "/"
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your account and API settings</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                  <CardDescription>Your Hospitable account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {user && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="col-span-2 text-sm">{user.name || "—"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <span className="text-sm font-medium">Email:</span>
                        <span className="col-span-2 text-sm">{user.email || "—"}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <span className="text-sm font-medium">User ID:</span>
                        <span className="col-span-2 font-mono text-xs text-muted-foreground">
                          {user.id || "—"}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Token Information</CardTitle>
                  <CardDescription>Details about your current API token</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {tokenInfo && !tokenInfo.message ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <span className="text-sm font-medium">Status:</span>
                        <span className="col-span-2 text-sm">
                          <Badge variant={tokenInfo.is_expired ? "destructive" : "default"}>
                            {tokenInfo.is_expired ? "Expired" : "Active"}
                          </Badge>
                        </span>
                      </div>
                      {tokenInfo.expires_at && (
                        <div className="grid grid-cols-3 gap-4">
                          <span className="text-sm font-medium">Expires:</span>
                          <span className="col-span-2 text-sm">
                            {new Date(tokenInfo.expires_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-4">
                        <span className="text-sm font-medium">Permissions:</span>
                        <div className="col-span-2 flex flex-wrap gap-1">
                          {tokenInfo.has_read_access && <Badge variant="secondary">Read</Badge>}
                          {tokenInfo.has_write_access && <Badge variant="secondary">Write</Badge>}
                        </div>
                      </div>
                      {tokenInfo.scopes && tokenInfo.scopes.length > 0 && (
                        <div className="grid grid-cols-3 gap-4">
                          <span className="text-sm font-medium">Scopes:</span>
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {tokenInfo.scopes.map((scope: string) => (
                              <Badge key={scope} variant="outline">
                                {scope}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {tokenInfo?.message || "Token information not available"}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                  <CardDescription>Manage your session</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={handleLogout}>
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
