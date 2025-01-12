"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 186, mobile: 80 },
  { month: "August", desktop: 305, mobile: 200 },
  { month: "September", desktop: 237, mobile: 120 },
  { month: "October", desktop: 73, mobile: 190 },
  { month: "November", desktop: 209, mobile: 130 },
  { month: "December", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-6))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-7))",
  },
} satisfies ChartConfig

export function ChartThree() {
  return (
    <Card className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-6">
    <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
    </CardHeader>
    <CardContent>
        <ChartContainer config={chartConfig}>
        <LineChart
            width={500}
            height={200}
            accessibilityLayer
            data={chartData}
            margin={{
            left: 12,
            right: 12,
            }}
        >
            <CartesianGrid vertical={false} />
            <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
            dataKey="desktop"
            type="monotone"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
            />
            <Line
            dataKey="mobile"
            type="monotone"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={false}
            />
        </LineChart>
        </ChartContainer>
    </CardContent>
    <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
        <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
            Showing total visitors for the last 6 months
            </div>
        </div>
        </div>
    </CardFooter>
    </Card>

  )
}
