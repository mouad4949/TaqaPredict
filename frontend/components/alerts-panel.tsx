import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AlertsPanelProps {
  data: any
  className?: string
}

export function AlertsPanel({ data, className }: AlertsPanelProps) {
  const status = data.payload.status
  const alert = data.alert

  const getAlertIcon = () => {
    if (!alert || alert.level === "info") return <Info className="h-6 w-6 text-blue-500" />
    if (alert.level === "warning") return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    return <AlertCircle className="h-6 w-6 text-red-500" />
  }

  return (
    <Card
      className={cn(
        "border-l-4",
        {
          "border-l-blue-500": !alert || alert.level === "info",
          "border-l-yellow-500": alert?.level === "warning",
          "border-l-red-500": alert?.level === "critical",
        },
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle>Alertes et Messages</CardTitle>
        <CardDescription>Informations et avertissements du système</CardDescription>
      </CardHeader>
      <CardContent>
        {!alert ? (
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Aucune alerte active</p>
              <p className="text-sm text-muted-foreground">Le système fonctionne normalement</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            {getAlertIcon()}
            <div className="space-y-2">
              <p className="font-medium">{alert.message}</p>
              {alert.time_indication && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Estimation temporelle:</span> {alert.time_indication}
                </p>
              )}
              {alert.details && <p className="text-sm text-muted-foreground">{alert.details}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
