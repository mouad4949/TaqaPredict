import type React from "react"
import { Battery, Thermometer, Sun, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricsCardsProps {
  data: any
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = data.payload.metrics

  const formatValue = (value: number, unit: string) => {
    return `${value.toFixed(2)} ${unit}`
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <MetricCard
        title="Puissance DC"
        value={formatValue(metrics.dc_power, "kW")}
        description="Puissance courant continu"
        icon={Battery}
        iconColor="text-blue-500"
      />

      <MetricCard
        title="Puissance AC"
        value={formatValue(metrics.ac_power, "kW")}
        description="Puissance courant alternatif"
        icon={Zap}
        iconColor="text-yellow-500"
      />

      <MetricCard
        title="Temp. Ambiante"
        value={formatValue(metrics.ambient_temp, "°C")}
        description="Température de l'air"
        icon={Thermometer}
        iconColor="text-green-500"
      />

      <MetricCard
        title="Temp. Module"
        value={formatValue(metrics.module_temp, "°C")}
        description="Température des panneaux"
        icon={Thermometer}
        iconColor="text-red-500"
      />

      <MetricCard
        title="Irradiation"
        value={formatValue(metrics.irradiation, "kW/m²")}
        description="Rayonnement solaire"
        icon={Sun}
        iconColor="text-orange-500"
      />

      <MetricCard
        title="Diff. Température"
        value={formatValue(metrics.temperature_diff, "°C")}
        description="Module - Ambiante"
        icon={Thermometer}
        iconColor="text-purple-500"
      />
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: React.ElementType
  iconColor: string
}

function MetricCard({ title, value, description, icon: Icon, iconColor }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

import { cn } from "@/lib/utils"
