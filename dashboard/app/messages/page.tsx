"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
            <p className="text-muted-foreground">View and send guest messages</p>
          </div>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Messages feature coming soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
