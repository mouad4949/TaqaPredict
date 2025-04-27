"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, FileText, PenToolIcon as Tool, Wrench } from "lucide-react"

// Données statiques pour la maintenance
const MAINTENANCE_DATA = {
  scheduled: [
    {
      id: "maint-001",
      title: "Nettoyage des Panneaux Solaires",
      description: "Nettoyage complet des panneaux solaires pour optimiser le rendement",
      location: "Centrale Solaire A - Tous les secteurs",
      scheduledDate: "2023-05-15T09:00:00.000Z",
      estimatedDuration: "8 heures",
      assignedTo: "Équipe de Maintenance",
      priority: "normal",
      status: "scheduled",
    },
    {
      id: "maint-002",
      title: "Inspection des Onduleurs",
      description: "Vérification et calibrage des onduleurs",
      location: "Centrale Solaire B - Secteur 2",
      scheduledDate: "2023-05-10T10:30:00.000Z",
      estimatedDuration: "4 heures",
      assignedTo: "Mohammed Alami",
      priority: "high",
      status: "scheduled",
    },
    {
      id: "maint-003",
      title: "Remplacement des Capteurs de Température",
      description: "Remplacement des capteurs défectueux identifiés lors de la dernière inspection",
      location: "Centrale Solaire A - Secteur 3",
      scheduledDate: "2023-05-20T08:00:00.000Z",
      estimatedDuration: "6 heures",
      assignedTo: "Équipe Technique",
      priority: "normal",
      status: "scheduled",
    },
  ],
  completed: [
    {
      id: "maint-004",
      title: "Maintenance Préventive des Câblages",
      description: "Vérification et réparation des câblages électriques",
      location: "Centrale Solaire C - Secteur 1",
      completedDate: "2023-04-25T16:45:00.000Z",
      duration: "5 heures",
      completedBy: "Équipe de Maintenance",
      findings: "Remplacement de 3 connecteurs endommagés et isolation de 2 sections de câbles",
      status: "completed",
    },
    {
      id: "maint-005",
      title: "Calibrage des Capteurs d'Irradiation",
      description: "Recalibrage des capteurs d'irradiation solaire",
      location: "Centrale Solaire A - Secteur 1",
      completedDate: "2023-04-20T14:30:00.000Z",
      duration: "3 heures",
      completedBy: "Karim Tazi",
      findings: "Écart de mesure de 2.3% corrigé. Tous les capteurs fonctionnent correctement.",
      status: "completed",
    },
  ],
}

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("scheduled")

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <SidebarNav />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Tool className="h-6 w-6 text-green-700" />
            <h1 className="text-2xl font-bold text-green-800">Maintenance</h1>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>5 maintenances planifiées ce mois-ci</span>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-md text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Prochaine maintenance: 10 mai 2023</span>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700">Planifier une Maintenance</Button>
          </div>

          <Tabs defaultValue="scheduled" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="scheduled" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Maintenances Planifiées
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Maintenances Terminées
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="space-y-4">
              {MAINTENANCE_DATA.scheduled.map((maintenance) => (
                <ScheduledMaintenanceCard key={maintenance.id} maintenance={maintenance} />
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {MAINTENANCE_DATA.completed.map((maintenance) => (
                <CompletedMaintenanceCard key={maintenance.id} maintenance={maintenance} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ScheduledMaintenanceCard({ maintenance }) {
  return (
    <Card className={`border-l-4 ${maintenance.priority === "high" ? "border-l-orange-500" : "border-l-blue-500"}`}>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{maintenance.title}</CardTitle>
            {maintenance.priority === "high" && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                Priorité Haute
              </span>
            )}
          </div>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3" />
            {new Date(maintenance.scheduledDate).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <span className="mx-1">•</span>
            {maintenance.location}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Détails
          </Button>
          <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
            Commencer
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{maintenance.description}</p>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Wrench className="h-3.5 w-3.5" />
            <span className="font-medium">Durée estimée:</span> {maintenance.estimatedDuration}
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">Assigné à:</span> {maintenance.assignedTo}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CompletedMaintenanceCard({ maintenance }) {
  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{maintenance.title}</CardTitle>
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800 border border-green-200">
              Terminé
            </span>
          </div>
          <CardDescription className="flex items-center gap-2 mt-1">
            <CheckCircle className="h-3 w-3" />
            {new Date(maintenance.completedDate).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
            <span className="mx-1">•</span>
            {maintenance.location}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          Rapport
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{maintenance.description}</p>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium mb-1">Résultats:</p>
          <p className="text-sm text-gray-600">{maintenance.findings}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">Durée:</span> {maintenance.duration}
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium">Réalisé par:</span> {maintenance.completedBy}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
