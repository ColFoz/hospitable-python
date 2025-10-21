"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api, Property } from "@/lib/api"
import { Building2, MapPin, Users, Bed } from "lucide-react"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await api.listProperties({ 
        include: "listings,details",
        per_page: 100 
      })
      setProperties(response.data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to load properties")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
            <p className="text-muted-foreground">Manage your vacation rental properties</p>
          </div>

          {error && (
            <Card className="mb-6 border-destructive">
              <CardContent className="pt-6">
                <p className="text-sm text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No properties found</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {properties.slice(0, 6).map((property) => (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span className="line-clamp-1">{property.name}</span>
                        <Badge variant="secondary">Active</Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{property.address || "No address"}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {property.bedrooms !== undefined && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {property.bedrooms} beds
                          </div>
                        )}
                        {property.max_guests !== undefined && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {property.max_guests} guests
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Properties</CardTitle>
                  <CardDescription>Complete list of your properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Bedrooms</TableHead>
                        <TableHead>Max Guests</TableHead>
                        <TableHead>ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell className="font-medium">{property.name}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {property.address || "—"}
                          </TableCell>
                          <TableCell>{property.bedrooms || "—"}</TableCell>
                          <TableCell>{property.max_guests || "—"}</TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {property.id.slice(0, 8)}...
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
