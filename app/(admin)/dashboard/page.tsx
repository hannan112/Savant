"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, TrendingUp, Activity, Loader2, RefreshCw, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface DashboardStats {
  stats: {
    totalConversions: number;
    recentConversions: number;
    changePercent: string;
    successRate: string;
  };
  conversionsByType: Record<string, number>;
  recentActivity: Array<{
    id: string;
    type: string;
    from: string;
    to: string;
    status: string;
    fileName: string;
    createdAt: string;
  }>;
  summary: {
    successful: number;
    failed: number;
    total: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      setError("")
      const response = await fetch("/api/dashboard/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }
      const data = await response.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchStats()
    }
  }, [status, router, fetchStats])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (status === "authenticated" && !loading) {
      const interval = setInterval(() => {
        fetchStats(true)
      }, 30000) // 30 seconds

      return () => clearInterval(interval)
    }
  }, [status, loading, fetchStats])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Error: {error}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Conversions",
      value: stats?.stats.totalConversions.toLocaleString() || "0",
      change: `+${stats?.stats.changePercent}%`,
      icon: FileText,
    },
    {
      title: "Recent (30 days)",
      value: stats?.stats.recentConversions.toLocaleString() || "0",
      change: "Last month",
      icon: TrendingUp,
    },
    {
      title: "Success Rate",
      value: `${stats?.stats.successRate}%`,
      change: "Overall",
      icon: Activity,
    },
    {
      title: "Failed",
      value: stats?.summary.failed.toLocaleString() || "0",
      change: "Total failures",
      icon: Download,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user?.name || session.user?.email}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => fetchStats(false)} 
            variant="outline"
            disabled={refreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button asChild variant="outline">
            <Link href="/blogs">
              <BookOpen className="h-4 w-4 mr-2" />
              Manage Blogs
            </Link>
          </Button>
          <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {activity.from.toUpperCase()} to {activity.to.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`text-sm ${activity.status === "success" ? "text-green-600" : "text-red-600"}`}>
                    {activity.status === "success" ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Converters</CardTitle>
            <CardDescription>Most used conversion tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.conversionsByType || {}).map(([type, count]) => {
                const percentage = stats?.stats.totalConversions
                  ? ((count / stats.stats.totalConversions) * 100).toFixed(1)
                  : 0
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {type.replace(/-/g, " ")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
