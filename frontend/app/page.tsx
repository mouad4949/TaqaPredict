"use client"

import React, { useState, useEffect, useCallback } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { AnomalyEventLog } from "@/components/anomaly-event-log"
import { ConnectionStatus } from "@/components/connection-status"
import { useWebSocket } from "@/hooks/use-websocket"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// URL du WebSocket
const WS_URL = "ws://localhost:1880/ws/live-data"

export default function DashboardPage() {
  // --- États ---
  const [currentData, setCurrentData] = useState<any>(null) // Stocke l'objet msg complet { payload: ..., alert: ... }
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [anomalyEvents, setAnomalyEvents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  // --- Callback pour traiter les messages (mémorisé) ---
  const handleNewData = useCallback((data: any) => {
    console.log(">>> DashboardPage: handleNewData called with:", data)

    // Vérification de la structure attendue { payload: ..., ... }
    if (!data || !data.payload) {
      console.warn("handleNewData received invalid data structure (missing payload):", data);
      return;
    }

    setCurrentData(data) // Mettre à jour avec l'objet msg complet

    // Ajout à l'historique (objet msg complet)
    setHistoricalData((prev) => {
      const updated = [...prev, data]
      if (updated.length > 20) return updated.slice(updated.length - 20);
      return updated;
    })

    // Ajout aux événements d'anomalie si status n'est pas normal (objet msg complet)
    if (data.payload.status !== "normal") {
      setAnomalyEvents((prev) => {
        const updated = [data, ...prev]
        if (updated.length > 10) return updated.slice(0, 10);
        return updated;
      })
    }
  }, []) // Dépendances vides car setState est stable

  // --- Hook WebSocket ---
  const { status, error, reconnect } = useWebSocket({
    url: WS_URL,
    onMessage: handleNewData, // Utilise la fonction mémorisée
  })

  // --- Gestion état de chargement ---
  useEffect(() => {
    if (status === 'connecting') setIsLoading(true);
    else if (status === 'connected' && !currentData) setIsLoading(true); // Attente data
    else setIsLoading(false); // Connecté+data ou erreur/déconnecté
  }, [status, currentData]);

  // --- Logique de Rendu Structurée ---

  // 1. État de Connexion en cours
  if (status === 'connecting') {
    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="text-center m-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-green-700">Connexion en cours...</h2>
          <p className="text-gray-600">Établissement de la connexion WebSocket.</p>
          <div className="mt-4 w-16 h-16 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Statut: {status}</p>
        </div>
      </div>
    );
  }

  // 2. État d'Erreur ou Déconnexion (après tentatives)
  if (status === 'error' || (status === 'disconnected' && error)) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <div className="text-center m-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-700">Erreur de Connexion</h2>
          <p className="text-gray-600">Impossible d'établir ou de maintenir la connexion au serveur.</p>
          <p className="text-sm text-gray-500 mt-2">
            Statut: {status} {error && `(${error.message})`}
          </p>
          <button
            onClick={reconnect}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Réessayer la Connexion
          </button>
        </div>
      </div>
    );
  }

  // 3. État Connecté, en attente des premières données
  if (status === 'connected' && !currentData) {
       return (
           <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
               <div className="text-center m-auto p-8 bg-white rounded-lg shadow-lg">
                   <h2 className="text-xl font-bold text-green-700">Connecté !</h2>
                   <p className="text-gray-600">En attente des premières données du serveur...</p>
                   <div className="mt-4 w-16 h-16 border-4 border-t-green-500 border-green-200 rounded-full animate-spin mx-auto"></div>
                   <p className="text-sm text-gray-500 mt-2">Statut: {status}</p>
               </div>
           </div>
       );
   }

  // 4. État Normal : Connecté et Données Reçues (currentData existe)
  if (status === 'connected' && currentData) {
    // Préparation des données pour le graphique (avec vérifications)
    const chartData = historicalData.map((item) => {
       if (!item || !item.payload || !item.payload.timestamp || !item.payload.metrics) {
           console.warn("Skipping invalid item for chart:", item);
           return null;
       }
      const timestamp = new Date(item.payload.timestamp);
      const formattedTime = !isNaN(timestamp.getTime()) ? timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Invalid Date";
      return {
        time: formattedTime,
        ac_power: item.payload.metrics.ac_power ?? 0,
        dc_power: item.payload.metrics.dc_power ?? 0,
        ambient_temp: item.payload.metrics.ambient_temp ?? 0,
        module_temp: item.payload.metrics.module_temp ?? 0,
        irradiation: (item.payload.metrics.irradiation ?? 0) * 1000,
        status: item.payload.status ?? 'unknown',
      };
    }).filter(Boolean); // Filtrer les potentiels nulls

    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
        <SidebarNav />
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header avec statut connexion */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-green-800">TAQA PREDICT - Tableau de Bord</h1>
              <ConnectionStatus status={status} error={error} onReconnect={reconnect} />
            </div>

            {/* Contenu principal avec onglets */}
            <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
              {/* Barre d'onglets */}
              <div className="flex border-b">
                <button
                  className={`px-6 py-3 font-medium ${activeTab === "overview" ? "bg-green-600 text-white" : "text-green-600 hover:bg-green-50"}`}
                  onClick={() => setActiveTab("overview")} >
                  Vue d'ensemble
                </button>
                <button
                  className={`px-6 py-3 font-medium ${activeTab === "analytics" ? "bg-green-600 text-white" : "text-green-600 hover:bg-green-50"}`}
                  onClick={() => setActiveTab("analytics")} >
                  Analytique
                </button>
                <button
                  className={`px-6 py-3 font-medium ${activeTab === "reports" ? "bg-green-600 text-white" : "text-green-600 hover:bg-green-50"}`}
                  onClick={() => setActiveTab("reports")} >
                  Rapports
                </button>
              </div>

              {/* Contenu Onglet Vue d'ensemble */}
              {activeTab === "overview" && (
                <div className="p-6">
                  {/* Grid Status / Alertes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Carte État Système */}
                    <div
                      className={`p-4 rounded-lg shadow-sm ${
                        currentData.payload?.status === "normal"
                          ? "bg-green-50 border-l-4 border-green-500"
                          : currentData.payload?.status === "warning" || currentData.payload?.status === "moderate"
                            ? "bg-yellow-50 border-l-4 border-yellow-500"
                            : "bg-red-50 border-l-4 border-red-500" // critical ou autre
                      }`}
                    >
                      <h2 className="font-bold text-lg mb-1">État du Système</h2>
                      <p className="text-sm text-gray-600 mb-3">Statut actuel de la centrale</p>
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-3 ${
                            currentData.payload?.status === "normal" ? "bg-green-500"
                            : currentData.payload?.status === "warning" || currentData.payload?.status === "moderate" ? "bg-yellow-500"
                            : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              currentData.payload?.status === "normal" ? "text-green-700"
                              : currentData.payload?.status === "warning" || currentData.payload?.status === "moderate" ? "text-yellow-700"
                              : "text-red-700"
                            }`}
                          >
                            {(currentData.payload?.status === "normal" && "Système Normal") ||
                             (currentData.payload?.status === "warning" && "Anomalie Détectée") ||
                             (currentData.payload?.status === "moderate" && "Anomalie Modérée") ||
                             (currentData.payload?.status === "critical" && "ALERTE CRITIQUE") ||
                             `État: ${currentData.payload?.status}` // Fallback
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {(currentData.payload?.status === "normal" && "Fonctionnement optimal") ||
                             (currentData.payload?.status === "warning" && "Attention requise") ||
                             (currentData.payload?.status === "moderate" && "Attention requise") || // Message pour moderate
                             (currentData.payload?.status === "critical" && "Intervention nécessaire") ||
                             "Vérifiez les détails." // Fallback
                             }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Carte Alertes et Messages */}
                    <div
                      className={`p-4 rounded-lg shadow-sm ${
                        !currentData.alert || currentData.alert.level === "info"
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : currentData.alert.level === "warning" || currentData.alert.level === "moderate"
                            ? "bg-yellow-50 border-l-4 border-yellow-500"
                            : "bg-red-50 border-l-4 border-red-500" // critical
                      }`}
                    >
                      <h2 className="font-bold text-lg mb-1">Alertes et Messages</h2>
                      <p className="text-sm text-gray-600 mb-3">Informations et avertissements</p>
                      {!currentData.alert || currentData.alert.level === "info" ? (
                        <div>
                           <p className="font-bold text-lg text-blue-700">Système Normal</p>
                           <p className="text-sm text-gray-600">Aucun risque imminent.</p>
                        </div>
                      ) : (
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              currentData.alert.level === "info" ? "text-blue-700"
                              : currentData.alert.level === "warning" || currentData.alert.level === "moderate" ? "text-yellow-700"
                              : "text-red-700" // critical
                            }`}
                          >
                            {currentData.alert.message ?? "Message d'alerte"}
                          </p>
                          {/* --- AFFICHAGE CORRIGÉ ICI --- */}
                          {currentData.alert.time_indication && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Estimation temporelle:</span>{" "}
                              {currentData.alert.time_indication}
                            </p>
                          )}
                          {currentData.alert.details && (
                            <p className="text-sm text-gray-600 mt-1">
                              {currentData.alert.details}
                            </p>
                          )}
                           {/* Optionnel: Afficher les détails techniques */}
                           {/* {currentData.alert.technical_details && (
                               <details className="text-xs mt-2">
                                   <summary>Détails Techniques</summary>
                                   <pre className="bg-gray-100 p-1 rounded text-gray-700 overflow-auto">
                                       {JSON.stringify(currentData.alert.technical_details, null, 2)}
                                   </pre>
                               </details>
                           )} */}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grid MetricCards */}
                  {currentData.payload?.metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <MetricCard title="Puissance DC" value={`${currentData.payload.metrics.dc_power?.toFixed(2) ?? 'N/A'} kW`} description="Puissance courant continu" color="bg-gradient-to-br from-blue-500 to-blue-600"/>
                      <MetricCard title="Puissance AC" value={`${currentData.payload.metrics.ac_power?.toFixed(2) ?? 'N/A'} kW`} description="Puissance courant alternatif" color="bg-gradient-to-br from-indigo-500 to-indigo-600"/>
                      <MetricCard title="Temp. Ambiante" value={`${currentData.payload.metrics.ambient_temp?.toFixed(2) ?? 'N/A'} °C`} description="Température de l'air" color="bg-gradient-to-br from-green-500 to-green-600"/>
                      <MetricCard title="Temp. Module" value={`${currentData.payload.metrics.module_temp?.toFixed(2) ?? 'N/A'} °C`} description="Température des panneaux" color="bg-gradient-to-br from-orange-500 to-orange-600"/>
                    </div>
                  )}

                  {/* Graphique */}
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <h2 className="font-bold text-lg mb-4">Tendances des Données Récentes</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                          <YAxis yAxisId="power" tick={{ fontSize: 12 }} />
                          <YAxis yAxisId="temp" orientation="right" tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.9)", border: "1px solid #ccc", borderRadius: "4px" }}/>
                          <Line yAxisId="power" type="monotone" dataKey="ac_power" name="Puissance AC (kW)" stroke="#16a34a" strokeWidth={2} dot={false} />
                          <Line yAxisId="temp" type="monotone" dataKey="module_temp" name="Temp. Module (°C)" stroke="#f97316" strokeWidth={2} dot={false}/>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Journal Anomalies */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="font-bold text-lg mb-4">Journal des Anomalies</h2>
                    <AnomalyEventLog events={anomalyEvents} />
                  </div>
                </div>
              )}

              {/* Contenu Autres Onglets (Placeholders) */}
              {activeTab === "analytics" && <AnalyticsTab />}
              {activeTab === "reports" && <ReportsTab />}

            </div> {/* Fin mb-6 bg-white... */}
          </div> {/* Fin max-w-7xl */}
        </div> {/* Fin flex-1 p-6 */}
      </div> // Fin flex h-screen
    );
  }

  // 5. État par Défaut / Fallback
  return (
    <div className="flex h-screen items-center justify-center">
      État inattendu de l'application. Statut WebSocket: {status}
    </div>
  );
}

// --- Interface et Composant MetricCard ---
interface MetricCardProps {
  title: string
  value: string
  description: string
  color: string
}

function MetricCard({ title, value, description, color }: MetricCardProps) {
  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <div className={`${color} p-4 text-white`}>
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="bg-white p-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Composant pour l'onglet Analytique
function AnalyticsTab() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <h2 className="font-bold text-lg mb-4">Performance Mensuelle</h2>
            <div className="h-80">
              {/* Ici, vous pourriez intégrer un graphique de performance mensuelle */}
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-green-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-gray-600">Graphique de performance mensuelle</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <h2 className="font-bold text-lg mb-4">Statistiques Clés</h2>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Production Totale</p>
                <p className="text-2xl font-bold">28,456 kWh</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Efficacité Moyenne</p>
                <p className="text-2xl font-bold">97.8%</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Anomalies Détectées</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Temps de Fonctionnement</p>
                <p className="text-2xl font-bold">720h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-4">Distribution des Anomalies</h2>
          <div className="h-64">
            {/* Ici, vous pourriez intégrer un graphique de distribution des anomalies */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-green-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  />
                </svg>
                <p className="text-gray-600">Graphique de distribution des anomalies</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-4">Prévisions de Production</h2>
          <div className="h-64">
            {/* Ici, vous pourriez intégrer un graphique de prévisions */}
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-green-500 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <p className="text-gray-600">Graphique de prévisions de production</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant pour l'onglet Rapports
function ReportsTab() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ReportCard
          title="Rapport Mensuel"
          description="Synthèse des performances du mois d'avril 2023"
          date="30/04/2023"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />

        <ReportCard
          title="Analyse des Anomalies"
          description="Détail des anomalies détectées et actions recommandées"
          date="25/04/2023"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          }
        />

        <ReportCard
          title="Prévisions Trimestrielles"
          description="Projections de production pour le prochain trimestre"
          date="15/04/2023"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="font-bold text-lg mb-4">Rapports Récents</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Titre
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Taille
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 1, title: "Rapport Mensuel - Mars 2023", type: "PDF", date: "31/03/2023", size: "2.4 MB" },
                { id: 2, title: "Analyse de Performance Q1 2023", type: "XLSX", date: "15/03/2023", size: "1.8 MB" },
                { id: 3, title: "Rapport d'Incidents - Février 2023", type: "PDF", date: "28/02/2023", size: "3.1 MB" },
                { id: 4, title: "Prévisions Énergétiques 2023", type: "PDF", date: "15/02/2023", size: "4.2 MB" },
                { id: 5, title: "Maintenance Préventive - Planning", type: "XLSX", date: "01/02/2023", size: "1.5 MB" },
              ].map((report) => (
                <tr key={report.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900 mr-3">Télécharger</button>
                    <button className="text-blue-600 hover:text-blue-900">Voir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-bold text-lg mb-4">Générer un Nouveau Rapport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de Rapport</label>
            <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500">
              <option>Rapport Mensuel</option>
              <option>Analyse des Anomalies</option>
              <option>Prévisions de Production</option>
              <option>Maintenance Préventive</option>
              <option>Rapport Personnalisé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500">
              <option>Avril 2023</option>
              <option>Mars 2023</option>
              <option>Février 2023</option>
              <option>Janvier 2023</option>
              <option>Q1 2023</option>
              <option>Personnalisé</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-green-600" name="format" value="pdf" defaultChecked />
                <span className="ml-2">PDF</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-green-600" name="format" value="xlsx" />
                <span className="ml-2">Excel</span>
              </label>
              <label className="inline-flex items-center">
                <input type="radio" className="form-radio text-green-600" name="format" value="csv" />
                <span className="ml-2">CSV</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Générer le Rapport
          </button>
        </div>
      </div>
    </div>
  )
}

// Composant pour les cartes de rapport
function ReportCard({ title, description, date, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-500">
      <div className="flex items-start">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">{date}</span>
            <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200">
              Télécharger
            </button>
          </div>
        </div>
      </div>
    </div>
   )
 }
