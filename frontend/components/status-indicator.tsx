import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  data: any
  className?: string
}

export function StatusIndicator({ data, className }: StatusIndicatorProps) {
  const status = data.payload.status

  const statusConfig = {
    normal: {
      color: "bg-green-500",
      text: "Système Normal",
      description: "Fonctionnement optimal",
    },
    warning: {
      color: "bg-yellow-500",
      text: "Anomalie Détectée",
      description: "Attention requise",
    },
    critical: {
      color: "bg-red-500",
      text: "ALERTE CRITIQUE",
      description: "Intervention nécessaire",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig]

  return (
    <Card
      className={cn(
        "border-l-4",
        {
          "border-l-green-500": status === "normal",
          "border-l-yellow-500": status === "warning",
          "border-l-red-500": status === "critical",
        },
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle>État du Système</CardTitle>
        <CardDescription>Statut actuel de la centrale</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={cn("h-8 w-8 rounded-full", config.color)} />
          <div>
            <p className="font-bold text-lg">{config.text}</p>
            <p className="text-sm text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
