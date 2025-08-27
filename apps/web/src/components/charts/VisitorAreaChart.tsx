"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUserAnalytics, getUserAnalyticsStats, UserAnalyticsData } from "@/services/userAnalytics"
import { useAuth } from "@/contexts/AuthContext"

const chartConfig = {
  users: {
    label: "Users",
  },
  participants: {
    label: "Participants",
    color: "#000000", // Black
  },
  donors: {
    label: "Donors", 
    color: "#666666", // Medium gray
  },
  admins: {
    label: "Admins",
    color: "#CCCCCC", // Light gray
  },
} satisfies ChartConfig

export function VisitorAreaChart() {
  const { user } = useAuth()
  const [chartData, setChartData] = React.useState<UserAnalyticsData[]>([])
  const [stats, setStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    loadUserData()
  }, [])

  // Add refresh functionality
  const refreshData = () => {
    setLoading(true)
    loadUserData(true) // Force fresh data
  }

  const loadUserData = async (forceFresh = false) => {
    try {
      const timestamp = new Date().toISOString();
      console.log(`📊 [${timestamp}] VisitorAreaChart.loadUserData(forceFresh=${forceFresh}) called`);
      console.log(`📊 [${timestamp}] Current user context:`, {
        email: user?.email,
        role: user?.role,
        uid: user?.uid,
        isAuthenticated: !!user
      });
      
      const [userData, userStats] = await Promise.all([
        getUserAnalytics(forceFresh),
        getUserAnalyticsStats()
      ])
      
      console.log(`📊 [${timestamp}] Chart data loaded:`, {
        dataPoints: userData.length,
        finalDay: userData[userData.length - 1],
        stats: userStats
      });
      
      setChartData(userData)
      setStats(userStats)
      console.log(`✅ [${timestamp}] User analytics loaded for chart`)
      
    } catch (error) {
      console.error('❌ Error loading user data for chart:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  if (loading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>User Growth Analytics</CardTitle>
            <CardDescription>Loading user analytics...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[250px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>User Growth Analytics</CardTitle>
          <CardDescription>
            Showing platform user growth for participants, donors, and admins
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
            className="hidden sm:flex"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillParticipants" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-participants)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-participants)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDonors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-donors)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-donors)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAdmins" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-admins)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-admins)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="participants"
              type="natural"
              fill="url(#fillParticipants)"
              stroke="var(--color-participants)"
              stackId="a"
            />
            <Area
              dataKey="donors"
              type="natural"
              fill="url(#fillDonors)"
              stroke="var(--color-donors)"
              stackId="a"
            />
            <Area
              dataKey="admins"
              type="natural"
              fill="url(#fillAdmins)"
              stroke="var(--color-admins)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        {stats && (
          <div className="flex w-full items-start gap-2 text-sm mt-4 pt-4 border-t">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                {stats.isGrowing ? (
                  <>
                    User growth trending up this month
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </>
                ) : (
                  <>
                    User growth stable this month
                    <TrendingDown className="h-4 w-4 text-gray-600" />
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Total Users: {stats.totalUsers} • 
                Participants: {stats.current.participants} • 
                Donors: {stats.current.donors} • 
                Admins: {stats.current.admins}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
