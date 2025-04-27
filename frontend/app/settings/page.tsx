"use client"

import { useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BellRing, Mail, Shield, User, Users, Wrench } from "lucide-react"

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false)

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <SidebarNav />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Wrench className="h-6 w-6 text-green-700" />
            <h1 className="text-2xl font-bold text-green-800">Paramètres</h1>
          </div>

          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Compte
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Équipe
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Compte</CardTitle>
                  <CardDescription>
                    Gérez les informations de votre compte et vos préférences personnelles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom</Label>
                        <Input id="name" defaultValue="TAQA Admin" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="admin@taqa-predict.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" defaultValue="+212 5XX-XXXXXX" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Langue</Label>
                        <Select defaultValue="fr">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="ar">العربية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau Horaire</Label>
                      <Select defaultValue="africa/casablanca">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Sélectionner un fuseau horaire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="africa/casablanca">Casablanca (GMT+1)</SelectItem>
                          <SelectItem value="europe/paris">Paris (GMT+2)</SelectItem>
                          <SelectItem value="europe/london">Londres (GMT+1)</SelectItem>
                          <SelectItem value="america/new_york">New York (GMT-4)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Préférences d'Affichage</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="theme">Thème</Label>
                          <p className="text-sm text-gray-500">Choisissez le thème de l'interface</p>
                        </div>
                        <Select defaultValue="light">
                          <SelectTrigger id="theme" className="w-40">
                            <SelectValue placeholder="Sélectionner un thème" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Clair</SelectItem>
                            <SelectItem value="dark">Sombre</SelectItem>
                            <SelectItem value="system">Système</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mode Compact</Label>
                          <p className="text-sm text-gray-500">Réduire l'espacement des éléments</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Enregistrer</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de Notification</CardTitle>
                  <CardDescription>
                    Configurez comment et quand vous souhaitez être notifié des événements du système.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications-enabled">Notifications</Label>
                        <p className="text-sm text-gray-500">Activer ou désactiver toutes les notifications</p>
                      </div>
                      <Switch
                        id="notifications-enabled"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-3">Canaux de Notification</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <div>
                              <Label htmlFor="email-notifications">Notifications par Email</Label>
                              <p className="text-sm text-gray-500">Recevoir des alertes par email</p>
                            </div>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                            disabled={!notificationsEnabled}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <Label htmlFor="sms-notifications">Notifications par SMS</Label>
                              <p className="text-sm text-gray-500">Recevoir des alertes par SMS</p>
                            </div>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                            disabled={!notificationsEnabled}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium mb-3">Types d'Alertes</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="critical-only">Alertes Critiques Uniquement</Label>
                            <p className="text-sm text-gray-500">Ne recevoir que les alertes de niveau critique</p>
                          </div>
                          <Switch
                            id="critical-only"
                            checked={criticalAlertsOnly}
                            onCheckedChange={setCriticalAlertsOnly}
                            disabled={!notificationsEnabled}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notification-frequency">Fréquence des Notifications</Label>
                          <Select defaultValue="realtime" disabled={!notificationsEnabled}>
                            <SelectTrigger id="notification-frequency">
                              <SelectValue placeholder="Sélectionner une fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Temps réel</SelectItem>
                              <SelectItem value="hourly">Résumé horaire</SelectItem>
                              <SelectItem value="daily">Résumé quotidien</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-green-600 hover:bg-green-700">Enregistrer</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité du Compte</CardTitle>
                  <CardDescription>
                    Gérez la sécurité de votre compte et les paramètres d'authentification.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-3">Mot de Passe</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Mot de Passe Actuel</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nouveau Mot de Passe</Label>
                            <Input id="new-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmer le Mot de Passe</Label>
                            <Input id="confirm-password" type="password" />
                          </div>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">Changer le Mot de Passe</Button>
                      </div>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="text-lg font-medium mb-3">Authentification à Deux Facteurs</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Statut</Label>
                          <p className="text-sm text-red-500">Non activé</p>
                        </div>
                        <Button variant="outline">Activer</Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">Sessions Actives</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Session Actuelle</p>
                              <p className="text-sm text-gray-500">Casablanca, Maroc • Chrome sur Windows</p>
                              <p className="text-xs text-gray-400 mt-1">Dernière activité: Aujourd'hui à 14:30</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Actif</Badge>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg border">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">Application Mobile</p>
                              <p className="text-sm text-gray-500">Casablanca, Maroc • TAQA App sur iPhone</p>
                              <p className="text-xs text-gray-400 mt-1">Dernière activité: Hier à 18:45</p>
                            </div>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              Déconnecter
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion de l'Équipe</CardTitle>
                  <CardDescription>Gérez les membres de votre équipe et leurs permissions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Membres de l'Équipe</h3>
                    <Button className="bg-green-600 hover:bg-green-700">Ajouter un Membre</Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nom
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Rôle
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Statut
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
                          {
                            id: 1,
                            name: "TAQA Admin",
                            email: "admin@taqa-predict.com",
                            role: "Administrateur",
                            status: "Actif",
                          },
                          {
                            id: 2,
                            name: "Mohammed Alami",
                            email: "m.alami@taqa-predict.com",
                            role: "Technicien",
                            status: "Actif",
                          },
                          {
                            id: 3,
                            name: "Fatima Benali",
                            email: "f.benali@taqa-predict.com",
                            role: "Analyste",
                            status: "Actif",
                          },
                          {
                            id: 4,
                            name: "Karim Tazi",
                            email: "k.tazi@taqa-predict.com",
                            role: "Gestionnaire",
                            status: "Inactif",
                          },
                        ].map((member) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {member.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  member.status === "Actif"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {member.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                                Modifier
                              </Button>
                              {member.id !== 1 && (
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                                  Supprimer
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-3">Invitations en Attente</h3>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Hassan Chraibi</p>
                          <p className="text-sm text-gray-500">h.chraibi@taqa-predict.com • Technicien</p>
                          <p className="text-xs text-gray-400 mt-1">Invité le: 25/04/2023</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Renvoyer
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Composant Badge manquant
function Badge({ children, className, variant = "default" }) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"

  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    outline: "bg-transparent border border-gray-200 text-gray-800",
  }

  return <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</span>
}
