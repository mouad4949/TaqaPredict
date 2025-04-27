"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
// Assuming these components from shadcn/ui might have base styles, we'll enhance them.
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Clock, Filter, Info, Search, X } from "lucide-react" // Added X for potential reset filter

// Données statiques pour les alertes (Data remains unchanged)
const ALERTS_DATA = {
  active: [
    { id: "alert-001", level: "critical", message: "ALERTE CRITIQUE - Risque de Défaillance (Niveau 3)", timestamp: "2025-04-27T12:30:00.000Z", details: "Déviation: 0.0027 au-dessus du seuil (25 anomalies consécutives). Défaillance probable dans les 24-48h si non résolue.", acknowledged: false, location: "Centrale Solaire A - Secteur 2", assignedTo: null },
    { id: "alert-002", level: "warning", message: "Comportement Anormal - Attention Requise (Niveau 2)", timestamp: "2025-04-27T13:45:00.000Z", details: "Déviation: 0.0776 au-dessus du seuil (20 anomalies consécutives). Risque potentiel dans les jours à venir (< 72h).", acknowledged: true, location: "Centrale Solaire A - Secteur 1", assignedTo: "tech.support@taqa-predict.com" },
    { id: "alert-003", level: "warning", message: "Anomalie Légère Détectée (Niveau 1)", timestamp: "2025-04-27T10:15:00.000Z", details: "Déviation mineure détectée. Surveillance recommandée.", acknowledged: false, location: "Centrale Solaire B - Secteur 3", assignedTo: null },
    // Added an info example to test filter styling if needed
    { id: "alert-006", level: "info", message: "Information Système", timestamp: "2023-04-28T08:00:00.000Z", details: "Maintenance préventive planifiée pour demain.", acknowledged: true, location: "Toutes Centrales", assignedTo: "ops@taqa-predict.com" },
  ],
  resolved: [
    { id: "alert-004", level: "critical", message: "ALERTE CRITIQUE - Surchauffe Détectée", timestamp: "2023-04-25T09:30:00.000Z", details: "Température des modules dépassant le seuil critique de 60°C. Risque de dommages matériels.", resolvedAt: "2023-04-25T11:45:00.000Z", resolution: "Nettoyage des panneaux et recalibrage du système de refroidissement", resolvedBy: "maintenance@taqa-predict.com", location: "Centrale Solaire A - Secteur 4" },
    { id: "alert-005", level: "warning", message: "Baisse de Performance Détectée", timestamp: "2023-04-23T14:20:00.000Z", details: "Rendement inférieur de 15% aux prévisions sur une période de 3 heures.", resolvedAt: "2023-04-23T17:30:00.000Z", resolution: "Conditions météorologiques temporaires. Retour à la normale après passage nuageux.", resolvedBy: "system@taqa-predict.com", location: "Centrale Solaire C - Secteur 1" },
  ],
}

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState<string | null>(null)

  // Filtering logic (remains unchanged)
  const filteredActiveAlerts = ALERTS_DATA.active.filter((alert) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      alert.message.toLowerCase().includes(searchLower) ||
      alert.details.toLowerCase().includes(searchLower) ||
      alert.location.toLowerCase().includes(searchLower) ||
      (alert.assignedTo && alert.assignedTo.toLowerCase().includes(searchLower)) ||
      alert.id.toLowerCase().includes(searchLower)

    const matchesLevel = filterLevel === null || alert.level === filterLevel
    return matchesSearch && matchesLevel
  })

  const filteredResolvedAlerts = ALERTS_DATA.resolved.filter((alert) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      searchQuery === "" ||
      alert.message.toLowerCase().includes(searchLower) ||
      alert.details.toLowerCase().includes(searchLower) ||
      alert.location.toLowerCase().includes(searchLower) ||
      (alert.resolvedBy && alert.resolvedBy.toLowerCase().includes(searchLower)) ||
      (alert.resolution && alert.resolution.toLowerCase().includes(searchLower)) ||
      alert.id.toLowerCase().includes(searchLower)

    const matchesLevel = filterLevel === null || alert.level === filterLevel
    return matchesSearch && matchesLevel
  })

  const resetFilters = () => {
      setSearchQuery('');
      setFilterLevel(null);
  }

  const isFiltered = searchQuery !== "" || filterLevel !== null;

  // Calculate counts after filtering
  const activeAlertCount = filteredActiveAlerts.length;
  const resolvedAlertCount = filteredResolvedAlerts.length;

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <SidebarNav />
      {/* Main Content Area - Enhanced Padding and Scroll */}
      <div className="flex-1 p-5 md:p-6 lg:p-8 overflow-y-auto scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Enhanced Spacing and Styles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"> {/* Increased mb */}
            <div className="flex items-center gap-3">
              {/* Enhanced Icon Background */}
              <div className="p-2.5 bg-green-100 rounded-full shadow-sm border border-green-200/50">
                <Bell className="h-6 w-6 text-green-700" />
              </div>
              {/* Enhanced Title Style */}
              <h1 className="text-2xl lg:text-3xl font-semibold text-green-800 tracking-tight">
                Gestion des Alertes
              </h1>
            </div>
            {/* Search and Filter Controls - Enhanced Styles */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Input - Enhanced Rounding, Shadow, Padding */}
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="Rechercher..." // Kept original placeholder
                  className="pl-11 pr-4 py-2.5 border border-gray-300 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:border-green-500 w-full sm:w-60 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-md text-sm placeholder-gray-400" // rounded-xl, py-2.5, hover/focus shadow
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {/* Filter Dropdown - Enhanced Rounding, Shadow */}
              <div className="relative group">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-xl shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200 border-gray-300 bg-white px-4 py-2.5" // rounded-xl, py-2.5, shadow
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filtrer</span>
                   {/* Filter active indicator */}
                  {filterLevel && <span className="ml-1.5 h-2 w-2 bg-green-500 rounded-full animate-ping absolute top-1.5 right-1.5 opacity-75"></span>}
                  {filterLevel && <span className="ml-1.5 h-2 w-2 bg-green-500 rounded-full absolute top-1.5 right-1.5"></span>}
                </Button>
                {/* Dropdown Content - Enhanced Rounding, Shadow, Padding */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg p-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible scale-95 group-hover:scale-100 transform transition-all duration-150 ease-out origin-top-right border border-gray-200/75"> {/* rounded-xl, shadow-lg */}
                  <p className="text-xs font-semibold text-gray-500 px-3 pb-1.5 border-b border-gray-100 mb-1.5">Filtrer par niveau :</p>
                  <div className="flex flex-col gap-1">
                    {/* Filter Buttons - Enhanced Rounding */}
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors duration-150 ${filterLevel === null ? "bg-green-100 text-green-800 font-medium" : "text-gray-700 hover:bg-gray-100"}`} // rounded-lg
                      onClick={() => setFilterLevel(null)}
                    >
                      Tous
                    </button>
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors duration-150 ${filterLevel === "critical" ? "bg-red-100 text-red-800 font-medium" : "text-gray-700 hover:bg-gray-100"}`} // rounded-lg
                      onClick={() => setFilterLevel("critical")}
                    >
                      Critique
                    </button>
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors duration-150 ${filterLevel === "warning" ? "bg-yellow-100 text-yellow-800 font-medium" : "text-gray-700 hover:bg-gray-100"}`} // rounded-lg
                      onClick={() => setFilterLevel("warning")}
                    >
                      Avertissement
                    </button>
                    <button
                      className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-colors duration-150 ${filterLevel === "info" ? "bg-blue-100 text-blue-800 font-medium" : "text-gray-700 hover:bg-gray-100"}`} // rounded-lg
                      onClick={() => setFilterLevel("info")}
                    >
                      Information
                    </button>
                  </div>
                </div>
              </div>
               {/* Reset Button - Enhanced Rounding, Shadow */}
               {isFiltered && (
                 <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 h-10 w-10 shadow-sm hover:shadow-md focus:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200" // rounded-full, h-10 w-10, shadow
                    onClick={resetFilters}
                    aria-label="Réinitialiser les filtres"
                 >
                    <X className="h-4 w-4" />
                 </Button>
              )}
            </div>
          </div>

          {/* Tabs Section - Enhanced Rounding, Shadow */}
          <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8"> {/* rounded-xl, shadow-inner */}
              {/* Tab Triggers - Enhanced Rounding, Shadow */}
              <TabsTrigger
                value="active"
                className="bg-gray-300 flex items-center justify-center gap-2 py-2.5 mx-5 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium" // rounded-lg, active shadow
              >
                <AlertCircle className="h-5 w-5" />
                <span>Alertes Actives</span>
                {/* Badge - Enhanced Rounding */}
                {activeAlertCount > 0 && (
                  <Badge variant="destructive" className="ml-1.5 rounded-full px-2 h-5 flex items-center justify-center animate-pulse scale-95 shadow-sm"> {/* rounded-full, shadow-sm */}
                    {activeAlertCount}
                  </Badge>
                 )}
              </TabsTrigger>
              <TabsTrigger
                value="resolved"
                className="bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium" // rounded-lg, active shadow
              >
                <CheckCircle className="h-5 w-5" />
                <span>Alertes Résolues</span>
                {/* Badge - Enhanced Rounding */}
                {resolvedAlertCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 rounded-full px-2 h-5 flex items-center justify-center bg-green-100 text-green-800 border-green-200/80 scale-95 shadow-sm"> {/* rounded-full, shadow-sm */}
                    {resolvedAlertCount}
                  </Badge>
                 )}
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            {/* "No Alerts" Placeholders - Enhanced Rounding, Shadow */}
            <TabsContent value="active" className="space-y-5 transition-opacity duration-300 animate-in fade-in-75">
              {activeAlertCount === 0 ? (
                <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md animate-in fade-in-75 zoom-in-95 border border-gray-100"> {/* rounded-xl, shadow-md */}
                  <Info className="h-14 w-14 mx-auto text-gray-300 mb-5" />
                  <h3 className="text-xl font-medium text-gray-700">Aucune alerte active</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    {isFiltered ? "Aucune alerte active ne correspond à vos critères." : "Excellent ! Tous les systèmes fonctionnent normalement."}
                  </p>
                   {/* Reset Button inside placeholder - Enhanced Rounding, Shadow */}
                   {isFiltered && (
                      <Button variant="link" className="mt-6 text-green-600 hover:text-green-700 text-sm font-medium rounded-lg px-4 py-2 hover:bg-green-50 transition-colors duration-150" onClick={resetFilters}> {/* rounded-lg */}
                          Effacer les filtres
                      </Button>
                  )}
                </div>
              ) : (
                filteredActiveAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
              )}
            </TabsContent>

            <TabsContent value="resolved" className="space-y-5 transition-opacity duration-300 animate-in fade-in-75">
              {resolvedAlertCount === 0 ? (
                <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md animate-in fade-in-75 zoom-in-95 border border-gray-100"> {/* rounded-xl, shadow-md */}
                  <Info className="h-14 w-14 mx-auto text-gray-300 mb-5" />
                  <h3 className="text-xl font-medium text-gray-700">Aucune alerte résolue</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    {isFiltered ? "Aucune alerte résolue ne correspond à vos critères." : "L'historique des alertes résolues apparaîtra ici."}
                  </p>
                   {/* Reset Button inside placeholder - Enhanced Rounding, Shadow */}
                  {isFiltered && (
                      <Button variant="link" className="mt-6 text-green-600 hover:text-green-700 text-sm font-medium rounded-lg px-4 py-2 hover:bg-green-50 transition-colors duration-150" onClick={resetFilters}> {/* rounded-lg */}
                          Effacer les filtres
                      </Button>
                  )}
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

// --- Alert Card Component --- Enhanced Rounding, Shadow
function AlertCard({ alert }: { alert: any }) {
  const levelStyles = {
    critical: { border: "border-l-red-500", iconColor: "text-red-500", icon: AlertCircle },
    warning: { border: "border-l-yellow-500", iconColor: "text-yellow-500", icon: AlertTriangle },
    info: { border: "border-l-blue-500", iconColor: "text-blue-500", icon: Info },
  }
  const styles = levelStyles[alert.level] || levelStyles.info // Default to info
  const IconComponent = styles.icon

  return (
    // Card - Enhanced Rounding, Shadow, Border
    <Card
      className={`border-l-[6px] ${styles.border} transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden bg-white rounded-xl shadow-md`} // rounded-xl, shadow-md, hover:shadow-xl, thicker border
    >
      <CardHeader className="pb-3 pt-5 px-6 flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Left Side: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-1.5">
            <CardTitle className={`text-lg font-semibold flex items-center gap-2.5 ${styles.iconColor}`}>
              <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{alert.message}</span>
            </CardTitle>
            {/* Badge - Enhanced Rounding, Shadow */}
            {alert.acknowledged && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200/80 text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm"> {/* rounded-full, shadow-sm */}
                Prise en charge
              </Badge>
            )}
          </div>
          <CardDescription className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />
              {new Date(alert.timestamp).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
            </span>
            <span className="hidden md:inline mx-1 text-gray-300">•</span>
            <span className="truncate" title={alert.location}>{alert.location}</span>
          </CardDescription>
        </div>
        {/* Right Side: Actions - Enhanced Rounding, Shadow */}
        <div className="flex gap-2.5 mt-2 md:mt-0 self-start flex-shrink-0">
          <Button variant="outline" size="sm" className="rounded-xl transition-all duration-150 hover:bg-gray-50 border-gray-300 bg-white text-xs px-3 shadow-sm hover:shadow focus:shadow"> {/* rounded-xl, shadow */}
            Détails
          </Button>
          {!alert.acknowledged ? (
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl transition-colors duration-150 text-xs px-3 shadow-sm hover:shadow focus:shadow"> {/* rounded-xl, shadow */}
              Prendre en charge
            </Button>
          ) : (
            <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl transition-colors duration-150 text-xs px-3 shadow-sm hover:shadow focus:shadow"> {/* rounded-xl, shadow */}
              Résoudre
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-0">
        <p className="text-sm text-gray-700/90 leading-relaxed mt-1 border-t border-gray-100 pt-4">{alert.details}</p> {/* Increased pt */}
        {alert.assignedTo && (
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1.5 pt-3 border-t border-gray-100"> {/* Increased pt */}
            <span className="font-medium text-gray-600">Assigné à:</span> {alert.assignedTo}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// --- Resolved Alert Card Component --- Enhanced Rounding, Shadow
function ResolvedAlertCard({ alert }: { alert: any }) {
  const levelStyles = { critical: { icon: AlertCircle }, warning: { icon: AlertTriangle }, info: { icon: Info } };

  // FIX: Get the style object first, then extract the icon component
  const styles = levelStyles[alert.level] || levelStyles.info; // Get the object { icon: ... }
  const IconComponent = styles.icon; // Extract the actual component function (AlertCircle, etc.)

  return (
    // Card - Enhanced Rounding, Shadow, Border, Background
    <Card className="border-l-[6px] border-l-gray-400 bg-gray-50/70 transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden rounded-xl shadow-md"> {/* rounded-xl, shadow-md, hover:shadow-xl, thicker border */}
      <CardHeader className="pb-3 pt-5 px-6 flex flex-col md:flex-row justify-between items-start gap-4">
        {/* Left Side: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-1.5">
            <CardTitle className="text-lg font-semibold text-gray-600 flex items-center gap-2.5">
              {/* Now IconComponent correctly holds the component function */}
              <IconComponent className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{alert.message}</span>
            </CardTitle>
             {/* Badge - Enhanced Rounding, Shadow */}
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200/80 text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm"> {/* rounded-full, shadow-sm */}
              Résolu
            </Badge>
          </div>
          <CardDescription className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-gray-500 mt-1">
             <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />
              {new Date(alert.timestamp).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
             </span>
             <span className="hidden md:inline mx-1 text-gray-300">•</span>
             <span className="truncate" title={alert.location}>{alert.location}</span>
          </CardDescription>
        </div>
        {/* Right Side: Action - Enhanced Rounding, Shadow */}
        <Button variant="outline" size="sm" className="rounded-xl transition-all duration-150 hover:bg-gray-100 border-gray-300 bg-white mt-2 md:mt-0 self-start flex-shrink-0 text-xs px-3 shadow-sm hover:shadow focus:shadow"> {/* rounded-xl, shadow */}
          Détails
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-5 pt-0">
        <p className="text-sm text-gray-600/90 leading-relaxed mt-1 line-clamp-2 border-t border-gray-100 pt-4">{alert.details}</p> {/* Increased pt */}
        {/* Resolution Details */}
        <div className="mt-3 pt-4 border-t border-gray-200"> {/* Increased pt */}
          <div className="text-xs text-gray-600 space-y-2">
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-700 w-24 flex-shrink-0">Résolu le:</span>
              <span className="text-gray-700">{new Date(alert.resolvedAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-700 w-24 flex-shrink-0">Résolu par:</span>
              <span className="text-gray-700">{alert.resolvedBy}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-medium text-gray-700 w-24 flex-shrink-0">Solution:</span>
              <span className="leading-snug text-gray-700">{alert.resolution}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}