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
  super_admin: {
    label: "Super Admins",
    color: "hsl(0, 72%, 51%)", // Red
  },
  platform_admin: {
    label: "Platform Admins",
    color: "hsl(262, 83%, 58%)", // Purple
  },
  shelter_admin: {
    label: "Shelter Admins",
    color: "hsl(221, 83%, 53%)", // Blue
  },
  participants: {
    label: "Participants",
    color: "hsl(142, 71%, 45%)", // Green
  },
  donors: {
    label: "Donors", 
    color: "hsl(47, 96%, 53%)", // Yellow/Gold
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
              <linearGradient id="fillSuperAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-super_admin)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-super_admin)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPlatformAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-platform_admin)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-platform_admin)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillShelterAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-shelter_admin)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-shelter_admin)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillParticipants" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-participants)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-participants)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillDonors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-donors)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-donors)" stopOpacity={0.1} />
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
              dataKey="shelter_admin"
              type="natural"
              fill="url(#fillShelterAdmin)"
              stroke="var(--color-shelter_admin)"
              stackId="a"
            />
            <Area
              dataKey="platform_admin"
              type="natural"
              fill="url(#fillPlatformAdmin)"
              stroke="var(--color-platform_admin)"
              stackId="a"
            />
            <Area
              dataKey="super_admin"
              type="natural"
              fill="url(#fillSuperAdmin)"
              stroke="var(--color-super_admin)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
        {stats && (
          <div className="flex w-full items-start gap-2 text-sm mt-4 pt-4 border-t">
            <div className="grid gap-2 w-full">
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
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 leading-none text-muted-foreground text-xs">
                <span className="font-semibold">Total Users: {stats.totalUsers}</span>
                <span style={{color: 'hsl(142, 71%, 45%)'}}>■ Participants: {stats.current.participants || 0}</span>
                <span style={{color: 'hsl(47, 96%, 53%)'}}>■ Donors: {stats.current.donors || 0}</span>
                <span style={{color: 'hsl(221, 83%, 53%)'}}>■ Shelter Admins: {stats.current.shelter_admin || 0}</span>
                <span style={{color: 'hsl(262, 83%, 58%)'}}>■ Platform Admins: {stats.current.platform_admin || 0}</span>
                <span style={{color: 'hsl(0, 72%, 51%)'}}>■ Super Admins: {stats.current.super_admin || 0}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
