"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Clock, Filter, Info, Search } from "lucide-react"

// Données statiques pour les alertes
const ALERTS_DATA = {
  active: [
    {
      id: "alert-001",
      level: "critical",
      message: "ALERTE CRITIQUE - Risque de Défaillance (Niveau 3)",
      timestamp: "2023-04-27T12:30:00.000Z",
      details:
        "Déviation: 0.0027 au-dessus du seuil (25 anomalies consécutives). Défaillance probable dans les 24-48h si non résolue.",
      acknowledged: false,
      location: "Centrale Solaire A - Secteur 2",
      assignedTo: null,
    },
    {
      id: "alert-002",
      level: "warning",
      message: "Comportement Anormal - Attention Requise (Niveau 2)",
      timestamp: "2023-04-27T13:45:00.000Z",
      details:
        "Déviation: 0.0776 au-dessus du seuil (20 anomalies consécutives). Risque potentiel dans les jours à venir (< 72h).",
      acknowledged: true,
      location: "Centrale Solaire A - Secteur 1",
      assignedTo: "tech.support@taqa-predict.com",
    },
    {
      id: "alert-003",
      level: "warning",
      message: "Anomalie Légère Détectée (Niveau 1)",
      timestamp: "2023-04-27T10:15:00.000Z",
      details: "Déviation mineure détectée. Surveillance recommandée.",
      acknowledged: false,
      location: "Centrale Solaire B - Secteur 3",
      assignedTo: null,
    },
  ],
  resolved: [
    {
      id: "alert-004",
      level: "critical",
      message: "ALERTE CRITIQUE - Surchauffe Détectée",
      timestamp: "2023-04-25T09:30:00.000Z",
      details: "Température des modules dépassant le seuil critique de 60°C. Risque de dommages matériels.",
      resolvedAt: "2023-04-25T11:45:00.000Z",
      resolution: "Nettoyage des panneaux et recalibrage du système de refroidissement",
      resolvedBy: "maintenance@taqa-predict.com",
      location: "Centrale Solaire A - Secteur 4",
    },
    {
      id: "alert-005",
      level: "warning",
      message: "Baisse de Performance Détectée",
      timestamp: "2023-04-23T14:20:00.000Z",
      details: "Rendement inférieur de 15% aux prévisions sur une période de 3 heures.",
      resolvedAt: "2023-04-23T17:30:00.000Z",
      resolution: "Conditions météorologiques temporaires. Retour à la normale après passage nuageux.",
      resolvedBy: "system@taqa-predict.com",
      location: "Centrale Solaire C - Secteur 1",
    },
  ],
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState<string | null>(null)

  // Filtrer les alertes en fonction de la recherche et du niveau
  const filteredActiveAlerts = ALERTS_DATA.active.filter((alert) => {
    const matchesSearch =
      searchQuery === "" ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = filterLevel === null || alert.level === filterLevel

    return matchesSearch && matchesLevel
  })

  const filteredResolvedAlerts = ALERTS_DATA.resolved.filter((alert) => {
    const matchesSearch =
      searchQuery === "" ||
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesLevel = filterLevel === null || alert.level === filterLevel

    return matchesSearch && matchesLevel
  })

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <SidebarNav />
      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-green-700" />
              <h1 className="text-2xl font-bold text-green-800">Gestion des Alertes</h1>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full sm:w-auto transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrer
                </Button>
                <div className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-lg p-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100 transform transition-all duration-200 ease-in-out origin-top-right">
                  <div className="flex flex-col gap-1">
                    <button
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${filterLevel === null ? "bg-green-100 text-green-800" : "hover:bg-gray-100"}`}
                      onClick={() => setFilterLevel(null)}
                    >
                      Tous
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${filterLevel === "critical" ? "bg-red-100 text-red-800" : "hover:bg-gray-100"}`}
                      onClick={() => setFilterLevel("critical")}
                    >
                      Critique
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${filterLevel === "warning" ? "bg-yellow-100 text-yellow-800" : "hover:bg-gray-100"}`}
                      onClick={() => setFilterLevel("warning")}
                    >
                      Avertissement
                    </button>
                    <button
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${filterLevel === "info" ? "bg-blue-100 text-blue-800" : "hover:bg-gray-100"}`}
                      onClick={() => setFilterLevel("info")}
                    >
                      Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 transition-all duration-300 bg-white/50 backdrop-blur-sm p-1 rounded-lg shadow-sm">
              <TabsTrigger value="active" className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <AlertCircle className="h-4 w-4" />
                Alertes Actives
                <Badge variant="destructive" className="ml-2 animate-pulse">
                  {ALERTS_DATA.active.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved" className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                <CheckCircle className="h-4 w-4" />
                Alertes Résolues
                <Badge variant="outline" className="ml-2">
                  {ALERTS_DATA.resolved.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4 transition-all duration-300 animate-in fade-in-50">
              {filteredActiveAlerts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm animate-in fade-in-50 zoom-in-95">
                  <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Aucune alerte active</h3>
                  <p className="mt-1 text-sm text-gray-500">Tous les systèmes fonctionnent normalement.</p>
                </div>
              ) : (
                filteredActiveAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              )}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4 transition-all duration-300 animate-in fade-in-50">
              {filteredResolvedAlerts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm animate-in fade-in-50 zoom-in-95">
                  <Info className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-900">Aucune alerte résolue</h3>
                  <p className="mt-1 text-sm text-gray-500">L'historique des alertes résolues apparaîtra ici.</p>
                </div>
              ) : (
                filteredResolvedAlerts.map((alert) => <ResolvedAlertCard key={alert.id} alert={alert} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function AlertCard({ alert }: { alert: any }) {
  return (
    <Card
      className={`border-l-4 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] ${
        alert.level === "critical"
          ? "border-l-red-500"
          : alert.level === "warning"
            ? "border-l-yellow-500"
            : "border-l-blue-500"
      }`}
    >
      <CardHeader className="pb-2 pt-4 px-5 flex flex-row justify-between items-start flex-wrap gap-2 sm:flex-nowrap">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">
              {alert.level === "critical" ? (
                <AlertCircle className="h-5 w-5 text-red-500 inline mr-2" />
              ) : alert.level === "warning" ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500 inline mr-2" />
              ) : (
                <Info className="h-5 w-5 text-blue-500 inline mr-2" />
              )}
              {alert.message}
            </CardTitle>
            {alert.acknowledged && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Prise en charge
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            {new Date(alert.timestamp).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <span className="mx-1">•</span>
            {alert.location}
          </CardDescription>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0 self-start">
          <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-gray-100">
            Détails
          </Button>
          {!alert.acknowledged ? (
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 transition-colors duration-200">
              Prendre en charge
            </Button>
          ) : (
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 transition-colors duration-200">
              Résoudre
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-5 py-2">
        <p className="text-sm text-gray-600 leading-relaxed">{alert.details}</p>
        {alert.assignedTo && (
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <span className="font-medium">Assigné à:</span> {alert.assignedTo}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ResolvedAlertCard({ alert }: { alert: any }) {
  return (
    <Card className="border-l-4 border-l-gray-300 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
      <CardHeader className="pb-2 pt-4 px-5 flex flex-row justify-between items-start flex-wrap gap-2 sm:flex-nowrap">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-gray-700">
              {alert.level === "critical" ? (
                <AlertCircle className="h-5 w-5 text-gray-400 inline mr-2" />
              ) : alert.level === "warning" ? (
                <AlertTriangle className="h-5 w-5 text-gray-400 inline mr-2" />
              ) : (
                <Info className="h-5 w-5 text-gray-400 inline mr-2" />
              )}
              {alert.message}
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Résolu
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            {new Date(alert.timestamp).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <span className="mx-1">•</span>
            {alert.location}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="transition-all duration-200 hover:bg-gray-100 mt-2 sm:mt-0">
          Détails
        </Button>
      </CardHeader>
      <CardContent className="px-5 py-2">
        <p className="text-sm text-gray-600 leading-relaxed">{alert.details}</p>
        <div className="mt-3 pt-3 border-t border-gray-100 rounded-b">
          <div className="text-xs text-gray-500 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="font-medium">Résolu le:</span>
              {new Date(alert.resolvedAt).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Résolu par:</span> {alert.resolvedBy}
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">Solution:</span> {alert.resolution}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
