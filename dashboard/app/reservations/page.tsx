"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { api, Reservation, Property } from "@/lib/api"
import { Calendar } from "lucide-react"

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // First get properties
      const propertiesData = await api.listProperties({ per_page: 100 })
      setProperties(propertiesData.data || [])
      
      // Then get reservations
      const today = new Date()
      const sixMonthsAgo = new Date(today)
      sixMonthsAgo.setMonth(today.getMonth() - 6)
      const sixMonthsLater = new Date(today)
      sixMonthsLater.setMonth(today.getMonth() + 6)
      
      if (propertiesData.data && propertiesData.data.length > 0) {
        const reservationsData = await api.queryReservations({
          properties: propertiesData.data.map(p => p.id),
          start_date: sixMonthsAgo.toISOString().split('T')[0],
          end_date: sixMonthsLater.toISOString().split('T')[0],
          include: "guest,properties",
          per_page: 100
        })
        setReservations(reservationsData.data || [])
      }
      
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to load reservations")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Reservations</h2>
            <p className="text-muted-foreground">View and manage your bookings</p>
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
              <p className="text-muted-foreground">Loading reservations...</p>
            </div>
          ) : reservations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No reservations found</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Reservations</CardTitle>
                <CardDescription>
                  {reservations.length} reservation{reservations.length !== 1 ? 's' : ''} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">
                          {reservation.guest_name || "Guest"}
                        </TableCell>
                        <TableCell>
                          {new Date(reservation.check_in).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(reservation.check_out).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(reservation.status)}>
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reservation.total_price ? 
                            `$${(reservation.total_price / 100).toFixed(2)}` : 
                            "—"
                          }
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {reservation.id.slice(0, 8)}...
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
