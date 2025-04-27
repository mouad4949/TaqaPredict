"use client"

import { useState } from "react"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"

interface DataTrendsChartProps {
  data: any[]
}

export function DataTrendsChart({ data }: DataTrendsChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["ac_power", "irradiation"])

  const chartData = data.map((item) => {
    const timestamp = new Date(item.payload.timestamp)
    const formattedTime = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    return {
      time: formattedTime,
      ac_power: item.payload.metrics.ac_power,
      dc_power: item.payload.metrics.dc_power,
      ambient_temp: item.payload.metrics.ambient_temp,
      module_temp: item.payload.metrics.module_temp,
      irradiation: item.payload.metrics.irradiation * 1000, // Scale for better visualization
      temperature_diff: item.payload.metrics.temperature_diff,
      status: item.payload.status,
    }
  })

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
    }
  }

  const metricConfig = {
    ac_power: { color: "#0ea5e9", name: "Puissance AC (kW)" },
    dc_power: { color: "#3b82f6", name: "Puissance DC (kW)" },
    ambient_temp: { color: "#22c55e", name: "Temp. Ambiante (°C)" },
    module_temp: { color: "#ef4444", name: "Temp. Module (°C)" },
    irradiation: { color: "#f97316", name: "Irradiation (W/m²)" },
    temperature_diff: { color: "#8b5cf6", name: "Diff. Température (°C)" },
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(metricConfig).map(([key, config]) => (
          <Button
            key={key}
            variant={selectedMetrics.includes(key) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric(key)}
            className="h-7 gap-1"
          >
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
            {config.name}
          </Button>
        ))}
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} tickMargin={10} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Legend />

            {selectedMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metricConfig[metric as keyof typeof metricConfig].name}
                stroke={metricConfig[metric as keyof typeof metricConfig].color}
                activeDot={{ r: 6 }}
                dot={(props: any) => {
                  const { cx, cy, payload } = props

                  // Highlight anomaly points
                  if (payload.status !== "normal") {
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4}
                        stroke={payload.status === "critical" ? "#ef4444" : "#f97316"}
                        strokeWidth={2}
                        fill={metricConfig[metric as keyof typeof metricConfig].color}
                      />
                    )
                  }

                  // Regular points
                  return <circle cx={cx} cy={cy} r={3} fill={metricConfig[metric as keyof typeof metricConfig].color} />
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
