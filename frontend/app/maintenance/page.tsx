"use client"

// Import useMemo and useCallback from React
import React, { useState, useMemo, useCallback } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
// Assuming these components from shadcn/ui might have base styles, we'll enhance them.
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Importing User from lucide-react
import { Calendar, CheckCircle, Clock, FileText, Users, Wrench } from "lucide-react"
// Using Wrench for the main page icon for clarity
import { Wrench as PageIcon } from "lucide-react"
import { X } from "lucide-react" // Keep X icon if used

// Données statiques pour la maintenance (Data remains unchanged)
const ALERTS_DATA = { /* ... keep your existing ALERTS_DATA object ... */ };
// Renamed to MAINTENANCE_DATA as per the code context
const MAINTENANCE_DATA = {
  scheduled: [
    { id: "maint-001", title: "Nettoyage des Panneaux Solaires", description: "Nettoyage complet des panneaux solaires pour optimiser le rendement", location: "Centrale Solaire A - Tous les secteurs", scheduledDate: "2023-05-15T09:00:00.000Z", estimatedDuration: "8 heures", assignedTo: "Équipe de Maintenance", priority: "normal", status: "scheduled" },
    { id: "maint-002", title: "Inspection des Onduleurs", description: "Vérification et calibrage des onduleurs", location: "Centrale Solaire B - Secteur 2", scheduledDate: "2023-05-10T10:30:00.000Z", estimatedDuration: "4 heures", assignedTo: "Mohammed Alami", priority: "high", status: "scheduled" },
    { id: "maint-003", title: "Remplacement des Capteurs de Température", description: "Remplacement des capteurs défectueux identifiés lors de la dernière inspection", location: "Centrale Solaire A - Secteur 3", scheduledDate: "2023-05-20T08:00:00.000Z", estimatedDuration: "6 heures", assignedTo: "Équipe Technique", priority: "normal", status: "scheduled" },
  ],
  completed: [
    { id: "maint-004", title: "Maintenance Préventive des Câblages", description: "Vérification et réparation des câblages électriques", location: "Centrale Solaire C - Secteur 1", completedDate: "2023-04-25T16:45:00.000Z", duration: "5 heures", completedBy: "Équipe de Maintenance", findings: "Remplacement de 3 connecteurs endommagés et isolation de 2 sections de câbles", status: "completed" },
    { id: "maint-005", title: "Calibrage des Capteurs d'Irradiation", description: "Recalibrage des capteurs d'irradiation solaire", location: "Centrale Solaire A - Secteur 1", completedDate: "2023-04-20T14:30:00.000Z", duration: "3 heures", completedBy: "Karim Tazi", findings: "Écart de mesure de 2.3% corrigé. Tous les capteurs fonctionnent correctement.", status: "completed" },
  ],
};


// --- Wrap Card Components with React.memo ---

// Wrap ScheduledMaintenanceCard with React.memo
const ScheduledMaintenanceCard = React.memo(({ maintenance }: { maintenance: any }) => {
  // ... (Keep the existing ScheduledMaintenanceCard component code exactly as before)
  // Including the styles calculation inside
    const priorityStyles = {
        high: { border: "border-l-orange-500", badgeBg: "bg-orange-100", badgeText: "text-orange-800", badgeBorder: "border-orange-200/80" },
        normal: { border: "border-l-blue-500", badgeBg: "bg-blue-100", badgeText: "text-blue-800", badgeBorder: "border-blue-200/80" }
    };
    const styles = priorityStyles[maintenance.priority] || priorityStyles.normal;

    return (
        <Card
          className={`border-l-[6px] ${styles.border} transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden bg-white rounded-xl shadow-md`}
        >
          <CardHeader className="pb-3 pt-5 px-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-1.5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-gray-400 mr-1 opacity-80"/>
                    <span className="leading-snug">{maintenance.title}</span>
                </CardTitle>
                {maintenance.priority === "high" && (
                  <Badge variant="outline" className={`${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder} text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm`}>
                    Priorité Haute
                  </Badge>
                )}
              </div>
              <CardDescription className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />
                  {new Date(maintenance.scheduledDate).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                </span>
                <span className="hidden md:inline mx-1 text-gray-300">•</span>
                <span className="truncate" title={maintenance.location}>{maintenance.location}</span>
              </CardDescription>
            </div>
            <div className="flex gap-2.5 mt-2 md:mt-0 self-start flex-shrink-0">
              <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 transition-all duration-150 hover:bg-gray-50 border-gray-300 bg-white text-xs px-3 shadow-sm hover:shadow focus:shadow">
                <FileText className="h-4 w-4" />
                Détails
              </Button>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl flex items-center gap-1.5 transition-colors duration-150 text-xs px-3 shadow-sm hover:shadow focus:shadow">
                 <Clock className="h-4 w-4" />
                 Commencer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-5 pt-2">
            <p className="text-sm text-gray-700/90 leading-relaxed mb-4 border-t border-gray-100 pt-4">{maintenance.description}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-600">Durée estimée:</span> {maintenance.estimatedDuration}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-600">Assigné à:</span> {maintenance.assignedTo}
              </div>
            </div>
          </CardContent>
        </Card>
      )
});
ScheduledMaintenanceCard.displayName = 'ScheduledMaintenanceCard'; // Good practice for debugging with memo

// Wrap CompletedMaintenanceCard with React.memo
const CompletedMaintenanceCard = React.memo(({ maintenance }: { maintenance: any }) => {
  // ... (Keep the existing CompletedMaintenanceCard component code exactly as before)
    return (
        <Card className="border-l-[6px] border-l-green-500 bg-white transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5 overflow-hidden rounded-xl shadow-md">
          <CardHeader className="pb-3 pt-5 px-6 flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-1.5">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                     <Wrench className="h-4 w-4 text-gray-400 mr-1 opacity-80"/>
                     <span className="leading-snug">{maintenance.title}</span>
                </CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200/80 text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm">
                  Terminé
                </Badge>
              </div>
              <CardDescription className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-green-600" />
                 {new Date(maintenance.completedDate).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                </span>
                <span className="hidden md:inline mx-1 text-gray-300">•</span>
                <span className="truncate" title={maintenance.location}>{maintenance.location}</span>
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1.5 transition-all duration-150 hover:bg-gray-50 border-gray-300 bg-white mt-2 md:mt-0 self-start flex-shrink-0 text-xs px-3 shadow-sm hover:shadow focus:shadow">
              <FileText className="h-4 w-4" />
              Rapport
            </Button>
          </CardHeader>
          <CardContent className="px-6 pb-5 pt-2">
            <p className="text-sm text-gray-700/90 leading-relaxed mb-4 border-t border-gray-100 pt-4">{maintenance.description}</p>
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/60 shadow-sm">
              <p className="text-xs font-semibold text-gray-600 mb-1.5">Résultats / Observations :</p>
              <p className="text-sm text-gray-700 leading-relaxed">{maintenance.findings || "Aucune observation particulière."}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-600">Durée:</span> {maintenance.duration}
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gray-400" />
                <span className="font-medium text-gray-600">Réalisé par:</span> {maintenance.completedBy}
              </div>
            </div>
          </CardContent>
        </Card>
      )
});
CompletedMaintenanceCard.displayName = 'CompletedMaintenanceCard'; // Good practice for debugging with memo


// --- Main Page Component ---
export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("scheduled")
  // State for search/filter would go here if needed, but not present in original code for this page
  // const [searchQuery, setSearchQuery] = useState("")
  // const [filterPriority, setFilterPriority] = useState<string | null>(null)

  // --- Memoize the filtered lists ---
  // If filtering/searching were added, they would look like this:
  // const filteredScheduledMaintenance = useMemo(() => {
  //   return MAINTENANCE_DATA.scheduled.filter(maint => {
  //     // Add search and filter logic here based on searchQuery and filterPriority
  //     const matchesSearch = true; // Placeholder
  //     const matchesPriority = true; // Placeholder
  //     return matchesSearch && matchesPriority;
  //   });
  // // Dependencies would be [searchQuery, filterPriority]
  // }, [searchQuery, filterPriority]);

  // const filteredCompletedMaintenance = useMemo(() => {
  //   return MAINTENANCE_DATA.completed.filter(maint => {
  //     // Add search and filter logic here based on searchQuery and filterPriority
  //     const matchesSearch = true; // Placeholder
  //     const matchesPriority = true; // Placeholder
  //     return matchesSearch && matchesPriority;
  //   });
  // // Dependencies would be [searchQuery, filterPriority]
  // }, [searchQuery, filterPriority]);

  // Since there's no filtering in the provided code for this page,
  // we directly use the static data, but keep the structure for potential future filtering.
  const scheduledMaintenance = MAINTENANCE_DATA.scheduled;
  const completedMaintenance = MAINTENANCE_DATA.completed;

  // Calculate counts
  const scheduledCount = scheduledMaintenance.length;
  const completedCount = completedMaintenance.length;

  // Simple example of finding the next maintenance date
  const nextMaintenanceDate = useMemo(() => {
      if (scheduledCount === 0) return null;
      // Sort by date ascending and take the first one
      const sorted = [...scheduledMaintenance].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
      return new Date(sorted[0].scheduledDate);
  }, [scheduledMaintenance]); // Depends only on the scheduled list

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <SidebarNav />
      {/* Main Content Area - Enhanced Padding and Scroll */}
      <div className="flex-1 p-5 md:p-6 lg:p-8 overflow-y-auto scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {/* Header Section - Enhanced Spacing and Styles */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-green-100 rounded-full shadow-sm border border-green-200/50">
              <PageIcon className="h-6 w-6 text-green-700" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-green-800 tracking-tight">
              Gestion de la Maintenance
            </h1>
          </div>

          {/* Summary Info & Action Button Section - Enhanced Styles */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center flex-wrap gap-3">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm border border-green-200/60">
                <Calendar className="h-4 w-4" />
                <span>{scheduledCount} maintenance{scheduledCount !== 1 ? 's' : ''} planifiée{scheduledCount !== 1 ? 's' : ''}</span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm border border-blue-200/60">
                <Clock className="h-4 w-4" />
                <span>Prochaine: {nextMaintenanceDate ? nextMaintenanceDate.toLocaleDateString("fr-FR", { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 rounded-xl px-5 py-2.5 shadow hover:shadow-md transition-all duration-200">
              Planifier une Maintenance
            </Button>
          </div>

          {/* Tabs Section - Enhanced Rounding, Shadow */}
          <Tabs defaultValue="scheduled" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8 rounded-xl ">
              <TabsTrigger
                value="scheduled"
                className="bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl mx-5 transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium"
              >
                <Calendar className="h-5 w-5" />
                <span>Planifiées</span>
                 {scheduledCount > 0 && (
 <Badge variant="destructive" className="ml-1.5 rounded-full px-2 h-5 flex items-center justify-center animate-pulse scale-95 shadow-sm"> {/* rounded-full, shadow-sm */}                     {scheduledCount}
                   </Badge>
                 )}
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl mx-5 transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Terminées</span>
                 {completedCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 rounded-full px-2 h-5 flex items-center justify-center bg-green-100 text-green-800 border-green-200/80 scale-95 shadow-sm">
                    {completedCount}
                  </Badge>
                 )}
              </TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="scheduled" className="space-y-5 transition-opacity duration-300 animate-in fade-in-75">
              {scheduledCount === 0 ? (
                 <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md animate-in fade-in-75 zoom-in-95 border border-gray-100">
                    <Calendar className="h-14 w-14 mx-auto text-gray-300 mb-5" />
                    <h3 className="text-xl font-medium text-gray-700">Aucune maintenance planifiée</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      Utilisez le bouton ci-dessus pour planifier de nouvelles tâches de maintenance.
                    </p>
                 </div>
              ) : (
                // Use the potentially filtered list if filtering were active
                scheduledMaintenance.map((maintenance) => (
                  // Pass the maintenance object as prop
                  <ScheduledMaintenanceCard key={maintenance.id} maintenance={maintenance} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-5 transition-opacity duration-300 animate-in fade-in-75">
              {completedCount === 0 ? (
                 <div className="text-center py-20 px-6 bg-white rounded-xl shadow-md animate-in fade-in-75 zoom-in-95 border border-gray-100">
                    <CheckCircle className="h-14 w-14 mx-auto text-gray-300 mb-5" />
                    <h3 className="text-xl font-medium text-gray-700">Aucune maintenance terminée</h3>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      L'historique des maintenances complétées s'affichera ici.
                    </p>
                 </div>
              ) : (
                 // Use the potentially filtered list if filtering were active
                completedMaintenance.map((maintenance) => (
                   // Pass the maintenance object as prop
                  <CompletedMaintenanceCard key={maintenance.id} maintenance={maintenance} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}