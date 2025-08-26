"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart, Line, LineChart } from "recharts"
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
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { getFinancialMetrics, getRecentTransactions } from "@/services/financialService"

interface FinancialChartData {
  date: string
  totalDonations: number
  platformRevenue: number
  participantAmount: number
  housingFund: number
  transactionCount: number
}

const chartConfig = {
  totalDonations: {
    label: "Total Donations",
    color: "#000000", // Black
  },
  platformRevenue: {
    label: "Platform Revenue (5%)", 
    color: "#666666", // Medium gray
  },
  participantAmount: {
    label: "Participant Amount (80%)",
    color: "#333333", // Dark gray
  },
  housingFund: {
    label: "Housing Fund (15%)",
    color: "#999999", // Light gray
  },
} satisfies ChartConfig

export function FinancialChart() {
  const [chartData, setChartData] = React.useState<FinancialChartData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartType, setChartType] = React.useState<"area" | "bar" | "line">("area")

  React.useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    try {
      console.log('📊 Loading financial data for chart...')
      
      const [, transactions] = await Promise.all([
        getFinancialMetrics(),
        getRecentTransactions(50) // Get more transactions for better chart data
      ])
      
      // Process transactions into time-series data
      const dataMap = new Map<string, FinancialChartData>()
      
      transactions.forEach(tx => {
        const date = new Date(tx.timestamp).toISOString().split('T')[0] // YYYY-MM-DD format
        const existing = dataMap.get(date) || {
          date,
          totalDonations: 0,
          platformRevenue: 0,
          participantAmount: 0,
          housingFund: 0,
          transactionCount: 0
        }
        
        // Calculate SmartFund distribution for this transaction
        const participantAmount = tx.amount * 0.80
        const housingFundAmount = tx.amount * 0.15
        const platformFeeAmount = tx.amount * 0.05
        
        existing.totalDonations += tx.amount
        existing.platformRevenue += platformFeeAmount
        existing.participantAmount += participantAmount
        existing.housingFund += housingFundAmount
        existing.transactionCount += 1
        
        dataMap.set(date, existing)
      })
      
      // Convert to array and sort by date
      const chartData = Array.from(dataMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      // If we have less than 7 days of data, generate some demo dates for better visualization
      if (chartData.length < 7) {
        const today = new Date()
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          const dateString = date.toISOString().split('T')[0]
          
          if (!dataMap.has(dateString)) {
            chartData.push({
              date: dateString,
              totalDonations: 0,
              platformRevenue: 0,
              participantAmount: 0,
              housingFund: 0,
              transactionCount: 0
            })
          }
        }
        
        // Sort again after adding demo dates
        chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      }
      
      setChartData(chartData)
      console.log('✅ Financial chart data loaded:', chartData.length, 'data points')
      
    } catch (error) {
      console.error('❌ Error loading financial data for chart:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 30
    if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
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
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                />
              }
            />
            <Bar dataKey="totalDonations" fill="var(--color-totalDonations)" radius={2} />
          </BarChart>
        )

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
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
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={{ stroke: '#666', strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                />
              }
            />
            <Line 
              type="monotone" 
              dataKey="totalDonations" 
              stroke="var(--color-totalDonations)" 
              strokeWidth={2}
              dot={{ fill: "var(--color-totalDonations)", strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="platformRevenue" 
              stroke="var(--color-platformRevenue)" 
              strokeWidth={2}
              dot={{ fill: "var(--color-platformRevenue)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        )

      default: // area
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="fillTotalDonations" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalDonations)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalDonations)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPlatformRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-platformRevenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-platformRevenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillParticipantAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-participantAmount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-participantAmount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
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
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="participantAmount"
              type="natural"
              fill="url(#fillParticipantAmount)"
              stroke="var(--color-participantAmount)"
              stackId="a"
            />
            <Area
              dataKey="platformRevenue"
              type="natural"
              fill="url(#fillPlatformRevenue)"
              stroke="var(--color-platformRevenue)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        )
    }
  }

  if (loading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>SmartFund Financial Analytics</CardTitle>
            <CardDescription>Loading financial analytics...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="h-[350px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalDonations = filteredData.reduce((sum, item) => sum + item.totalDonations, 0)
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.platformRevenue, 0)
  const totalTransactions = filteredData.reduce((sum, item) => sum + item.transactionCount, 0)
  const isGrowing = filteredData.length > 1 && 
    filteredData[filteredData.length - 1].totalDonations > filteredData[0].totalDonations

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            SmartFund Financial Analytics
          </CardTitle>
          <CardDescription>
            Donation flow and revenue breakdown with 80-15-5 distribution model
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={chartType} onValueChange={(value) => setChartType(value as "area" | "bar" | "line")}>
            <SelectTrigger className="w-[120px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="area" className="rounded-lg">Area Chart</SelectItem>
              <SelectItem value="bar" className="rounded-lg">Bar Chart</SelectItem>
              <SelectItem value="line" className="rounded-lg">Line Chart</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] rounded-lg">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 90 days
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
          className="aspect-auto h-[350px] w-full"
        >
          {renderChart()}
        </ChartContainer>
        <div className="flex w-full items-start gap-2 text-sm mt-4 pt-4 border-t">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isGrowing ? (
                <>
                  Financial performance trending up
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </>
              ) : (
                <>
                  Financial performance stable
                  <TrendingDown className="h-4 w-4 text-gray-600" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Total Donations: ${totalDonations.toLocaleString()} • 
              Platform Revenue: ${totalRevenue.toLocaleString()} • 
              Transactions: {totalTransactions} •
              Avg: ${totalTransactions > 0 ? (totalDonations / totalTransactions).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
