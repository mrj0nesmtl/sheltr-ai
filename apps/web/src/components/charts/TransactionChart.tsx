"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ComposedChart, Area, AreaChart } from "recharts"
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
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"
import { getRecentTransactions } from "@/services/financialService"

interface TransactionChartData {
  date: string
  transactionCount: number
  avgAmount: number
  totalVolume: number
  successRate: number
  completedCount: number
  pendingCount: number
  hourOfDay?: number
}

const chartConfig = {
  transactionCount: {
    label: "Transaction Count",
    color: "#000000", // Black
  },
  avgAmount: {
    label: "Average Amount",
    color: "#666666", // Medium gray
  },
  totalVolume: {
    label: "Total Volume",
    color: "#333333", // Dark gray
  },
  successRate: {
    label: "Success Rate %",
    color: "#999999", // Light gray
  },
  completedCount: {
    label: "Completed",
    color: "#000000", // Black
  },
  pendingCount: {
    label: "Pending",
    color: "#CCCCCC", // Light gray
  }
} satisfies ChartConfig

export function TransactionChart() {
  const [chartData, setChartData] = React.useState<TransactionChartData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [timeRange, setTimeRange] = React.useState("30d")
  const [chartType, setChartType] = React.useState<"volume" | "frequency" | "success" | "hourly">("volume")

  React.useEffect(() => {
    loadTransactionData()
  }, [])

  const loadTransactionData = async () => {
    try {
      console.log('📊 Loading transaction data for analytics chart...')
      
      const transactions = await getRecentTransactions(100) // Get more transactions for better analytics
      
      if (chartType === "hourly") {
        // Process by hour of day
        const hourlyMap = new Map<number, TransactionChartData>()
        
        for (let hour = 0; hour < 24; hour++) {
          hourlyMap.set(hour, {
            date: `${hour.toString().padStart(2, '0')}:00`,
            transactionCount: 0,
            avgAmount: 0,
            totalVolume: 0,
            successRate: 0,
            completedCount: 0,
            pendingCount: 0,
            hourOfDay: hour
          })
        }
        
        transactions.forEach(tx => {
          const date = new Date(tx.timestamp)
          const hour = date.getHours()
          const existing = hourlyMap.get(hour)!
          
          existing.transactionCount += 1
          existing.totalVolume += tx.amount
          
          if (tx.status === 'completed') {
            existing.completedCount += 1
          } else {
            existing.pendingCount += 1
          }
        })
        
        // Calculate averages and success rates
        hourlyMap.forEach((data) => {
          data.avgAmount = data.transactionCount > 0 ? data.totalVolume / data.transactionCount : 0
          data.successRate = data.transactionCount > 0 ? (data.completedCount / data.transactionCount) * 100 : 0
        })
        
        const hourlyData = Array.from(hourlyMap.values())
        setChartData(hourlyData)
        
      } else {
        // Process by date
        const dataMap = new Map<string, TransactionChartData>()
        
        transactions.forEach(tx => {
          const date = new Date(tx.timestamp).toISOString().split('T')[0] // YYYY-MM-DD format
          const existing = dataMap.get(date) || {
            date,
            transactionCount: 0,
            avgAmount: 0,
            totalVolume: 0,
            successRate: 0,
            completedCount: 0,
            pendingCount: 0
          }
          
          existing.transactionCount += 1
          existing.totalVolume += tx.amount
          
          if (tx.status === 'completed') {
            existing.completedCount += 1
          } else {
            existing.pendingCount += 1
          }
          
          dataMap.set(date, existing)
        })
        
        // Calculate averages and success rates
        dataMap.forEach((data) => {
          data.avgAmount = data.transactionCount > 0 ? data.totalVolume / data.transactionCount : 0
          data.successRate = data.transactionCount > 0 ? (data.completedCount / data.transactionCount) * 100 : 0
        })
        
        // Convert to array and sort by date
        const chartData = Array.from(dataMap.values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        // Add empty days if needed for better visualization
        if (chartData.length < 7) {
          const today = new Date()
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateString = date.toISOString().split('T')[0]
            
            if (!dataMap.has(dateString)) {
              chartData.push({
                date: dateString,
                transactionCount: 0,
                avgAmount: 0,
                totalVolume: 0,
                successRate: 100, // Default to 100% when no transactions
                completedCount: 0,
                pendingCount: 0
              })
            }
          }
          
          chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }
        
        setChartData(chartData)
      }
      
      console.log('✅ Transaction chart data loaded:', chartData.length, 'data points')
      
    } catch (error) {
      console.error('❌ Error loading transaction data for chart:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (!loading) {
      loadTransactionData()
    }
  }, [chartType])

  const filteredData = chartData.filter((item) => {
    if (chartType === "hourly") return true // Show all hours
    
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
      case "frequency":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={chartType === "hourly" ? "date" : "date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (chartType === "hourly") return value
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
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (chartType === "hourly") return `${value}`
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                  formatter={(value) => [value.toString(), '']}
                />
              }
            />
            <Bar dataKey="transactionCount" fill="var(--color-transactionCount)" radius={2} />
          </BarChart>
        )

      case "success":
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (chartType === "hourly") return value
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <YAxis 
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (chartType === "hourly") return `${value}`
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })
                  }}
                />
              }
            />
            <Bar yAxisId="left" dataKey="completedCount" fill="var(--color-completedCount)" radius={2} />
            <Bar yAxisId="left" dataKey="pendingCount" fill="var(--color-pendingCount)" radius={2} />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="successRate" 
              stroke="#4CAF50" 
              strokeWidth={3}
              dot={{ fill: "#4CAF50", strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        )

      case "hourly":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="fillTransactionCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-transactionCount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-transactionCount)"
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
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Hour: ${value}`}
                  formatter={(value) => [value.toString(), '']}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="transactionCount"
              type="natural"
              fill="url(#fillTransactionCount)"
              stroke="var(--color-transactionCount)"
            />
          </AreaChart>
        )

      default: // volume
        return (
          <ComposedChart {...commonProps}>
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
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toString()}
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
                />
              }
            />
            <Bar yAxisId="left" dataKey="totalVolume" fill="var(--color-totalVolume)" radius={2} />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="transactionCount" 
              stroke="var(--color-transactionCount)" 
              strokeWidth={3}
              dot={{ fill: "var(--color-transactionCount)", strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        )
    }
  }

  if (loading) {
    return (
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Transaction Analytics</CardTitle>
            <CardDescription>Loading transaction analytics...</CardDescription>
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

  const totalTransactions = filteredData.reduce((sum, item) => sum + item.transactionCount, 0)
  const totalVolume = filteredData.reduce((sum, item) => sum + item.totalVolume, 0)
  const avgTransactionAmount = totalTransactions > 0 ? totalVolume / totalTransactions : 0
  const avgSuccessRate = filteredData.length > 0 
    ? filteredData.reduce((sum, item) => sum + item.successRate, 0) / filteredData.length 
    : 0

  const getChartTitle = () => {
    switch (chartType) {
      case "frequency": return "Transaction Frequency"
      case "success": return "Transaction Success Rate"
      case "hourly": return "Hourly Transaction Pattern"
      default: return "Transaction Volume"
    }
  }

  const getChartDescription = () => {
    switch (chartType) {
      case "frequency": return "Daily transaction count and activity patterns"
      case "success": return "Completed vs pending transactions with success rate"
      case "hourly": return "24-hour transaction activity pattern"
      default: return "Total transaction volume with transaction count overlay"
    }
  }

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {getChartTitle()}
          </CardTitle>
          <CardDescription>
            {getChartDescription()}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Select value={chartType} onValueChange={(value) => setChartType(value as "volume" | "frequency" | "success" | "hourly")}>
            <SelectTrigger className="w-[140px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="volume" className="rounded-lg">Volume</SelectItem>
              <SelectItem value="frequency" className="rounded-lg">Frequency</SelectItem>
              <SelectItem value="success" className="rounded-lg">Success Rate</SelectItem>
              <SelectItem value="hourly" className="rounded-lg">Hourly Pattern</SelectItem>
            </SelectContent>
          </Select>
          {chartType !== "hourly" && (
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
          )}
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
              {totalTransactions > 0 ? (
                <>
                  Transaction activity trending up
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </>
              ) : (
                <>
                  No recent transaction activity
                  <TrendingDown className="h-4 w-4 text-gray-600" />
                </>
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Total: {totalTransactions} transactions • 
              Volume: ${totalVolume.toLocaleString()} • 
              Avg: ${avgTransactionAmount.toFixed(2)} • 
              Success: {avgSuccessRate.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
