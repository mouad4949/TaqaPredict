"use client"

import React, { useState, useCallback, useMemo } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
// Assuming these components from shadcn/ui might have base styles, we'll enhance them.
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BellRing, Mail, Phone, Shield, User, Users, Wrench } from "lucide-react"
import { X } from "lucide-react"

// --- Child Component for Account Settings --- Enhanced Rounding
const AccountSettings = React.memo(() => {
    console.log("Rendering AccountSettings");
    return (
        // Card: Enhanced Rounding
        <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Informations du Compte</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                    Gérez les informations de votre compte et vos préférences personnelles.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Section 1: Basic Info */}
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nom</Label>
                            {/* Input: Enhanced Rounding */}
                            <Input id="name" defaultValue="TAQA Admin" className="rounded-lg shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                             {/* Input: Enhanced Rounding */}
                            <Input id="email" type="email" defaultValue="admin@taqa-predict.com" className="rounded-lg shadow-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Téléphone</Label>
                             {/* Input: Enhanced Rounding */}
                            <Input id="phone" type="tel" defaultValue="+212 5XX-XXXXXX" className="rounded-lg shadow-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="language" className="text-sm font-medium text-gray-700">Langue</Label>
                             {/* Select: Enhanced Rounding */}
                            <Select defaultValue="fr">
                                <SelectTrigger id="language" className="rounded-lg shadow-sm">
                                    <SelectValue placeholder="Sélectionner une langue" />
                                </SelectTrigger>
                                 {/* Select Content: Enhanced Rounding */}
                                <SelectContent className="rounded-lg shadow-md">
                                    <SelectItem value="fr">Français</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="ar">العربية</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Fuseau Horaire</Label>
                         {/* Select: Enhanced Rounding */}
                        <Select defaultValue="africa/casablanca">
                            <SelectTrigger id="timezone" className="rounded-lg shadow-sm">
                                <SelectValue placeholder="Sélectionner un fuseau horaire" />
                            </SelectTrigger>
                             {/* Select Content: Enhanced Rounding */}
                            <SelectContent className="rounded-lg shadow-md">
                                <SelectItem value="africa/casablanca">Casablanca (GMT+1)</SelectItem>
                                <SelectItem value="europe/paris">Paris (GMT+2)</SelectItem>
                                <SelectItem value="europe/london">Londres (GMT+1)</SelectItem>
                                <SelectItem value="america/new_york">New York (GMT-4)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 {/* Section 2: Display Preferences */}
                 <div className="border-t border-gray-100 pt-6 space-y-5">
                    <h3 className="text-lg font-medium text-gray-800">Préférences d'Affichage</h3>
                    <div className="space-y-4">
                       {/* Preference Container: Enhanced Rounding */}
                      <div className="flex items-center justify-between p-4 bg-gray-50/60 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                          <Label htmlFor="theme" className="font-medium text-gray-700">Thème</Label>
                          <p className="text-xs text-gray-500 mt-0.5">Choisissez le thème de l'interface</p>
                        </div>
                        <Select defaultValue="light">
                          <SelectTrigger id="theme" className="w-40 rounded-lg shadow-sm bg-white"> {/* Enhanced Rounding */}
                            <SelectValue placeholder="Sélectionner un thème" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-md"> {/* Enhanced Rounding */}
                            <SelectItem value="light">Clair</SelectItem>
                            <SelectItem value="dark">Sombre</SelectItem>
                            <SelectItem value="system">Système</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       {/* Preference Container: Enhanced Rounding */}
                      <div className="flex items-center justify-between p-4 bg-gray-50/60 rounded-lg border border-gray-100 shadow-sm">
                        <div>
                          <Label className="font-medium text-gray-700">Mode Compact</Label>
                          <p className="text-xs text-gray-500 mt-0.5">Réduire l'espacement des éléments</p>
                        </div>
                         {/* Switch: Styling usually controlled by UI library */}
                        <Switch />
                      </div>
                    </div>
                  </div>
                {/* Action Buttons: Enhanced Rounding */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" className="rounded-lg shadow-sm hover:shadow transition-shadow duration-150">Annuler</Button>
                    <Button className="bg-green-600 hover:bg-green-700 rounded-lg shadow hover:shadow-md transition-all duration-150">Enregistrer les Modifications</Button>
                </div>
            </CardContent>
        </Card>
    );
});
AccountSettings.displayName = 'AccountSettings';

// --- Child Component for Notification Settings --- Enhanced Rounding
const NotificationSettings = React.memo(({
    notificationsEnabled, onNotificationsEnabledChange,
    emailNotifications, onEmailNotificationsChange,
    smsNotifications, onSmsNotificationsChange,
    criticalAlertsOnly, onCriticalAlertsOnlyChange
}: { /* Props type */ }) => {
    console.log("Rendering NotificationSettings");
    return (
        // Card: Enhanced Rounding
        <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Préférences de Notification</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                    Configurez comment et quand vous souhaitez être notifié.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Section 1: Global Enable/Disable Container: Enhanced Rounding */}
                <div className="space-y-4 p-4 bg-gray-50/60 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="notifications-enabled" className="text-base font-medium text-gray-700">Activer les Notifications</Label>
                            <p className="text-xs text-gray-500 mt-0.5">Activer ou désactiver toutes les notifications système.</p>
                        </div>
                        <Switch
                            id="notifications-enabled"
                            checked={notificationsEnabled}
                            onCheckedChange={onNotificationsEnabledChange}
                        />
                    </div>
                </div>
                 {/* Section 2 & 3 Container */}
                 <div className={`space-y-8 transition-opacity duration-300 ${!notificationsEnabled ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    {/* Section 2: Channels */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Canaux de Notification</h3>
                        <div className="space-y-4">
                            {/* Channel Container: Enhanced Rounding */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200/80 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <Label htmlFor="email-notifications" className="font-medium text-gray-700">Notifications par Email</Label>
                                        <p className="text-xs text-gray-500 mt-0.5">Recevoir des alertes par email à <span className="font-medium">admin@taqa-predict.com</span></p>
                                    </div>
                                </div>
                                <Switch
                                    id="email-notifications"
                                    checked={emailNotifications}
                                    onCheckedChange={onEmailNotificationsChange}
                                    disabled={!notificationsEnabled}
                                />
                            </div>
                            {/* Channel Container: Enhanced Rounding */}
                            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200/80 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <Label htmlFor="sms-notifications" className="font-medium text-gray-700">Notifications par SMS</Label>
                                        <p className="text-xs text-gray-500 mt-0.5">Recevoir des alertes par SMS au <span className="font-medium">+212 5XX-XXXXXX</span></p>
                                    </div>
                                </div>
                                <Switch
                                    id="sms-notifications"
                                    checked={smsNotifications}
                                    onCheckedChange={onSmsNotificationsChange}
                                    disabled={!notificationsEnabled}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Section 3: Alert Types & Frequency */}
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Types et Fréquence</h3>
                        <div className="space-y-4">
                           {/* Type Container: Enhanced Rounding */}
                           <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200/80 shadow-sm">
                              <div>
                                <Label htmlFor="critical-only" className="font-medium text-gray-700">Alertes Critiques Uniquement</Label>
                                <p className="text-xs text-gray-500 mt-0.5">Ne recevoir que les alertes de niveau critique.</p>
                              </div>
                              <Switch
                                id="critical-only"
                                checked={criticalAlertsOnly}
                                onCheckedChange={onCriticalAlertsOnlyChange}
                                disabled={!notificationsEnabled}
                              />
                            </div>
                           {/* Frequency Select */}
                           <div className="space-y-1.5 pt-2">
                             <Label htmlFor="notification-frequency" className="text-sm font-medium text-gray-700">Fréquence des Résumés</Label>
                             <Select defaultValue="realtime" disabled={!notificationsEnabled || criticalAlertsOnly}>
                                {/* Select Trigger: Enhanced Rounding */}
                               <SelectTrigger id="notification-frequency" className="rounded-lg shadow-sm">
                                 <SelectValue placeholder="Sélectionner une fréquence" />
                               </SelectTrigger>
                                {/* Select Content: Enhanced Rounding */}
                               <SelectContent className="rounded-lg shadow-md">
                                 <SelectItem value="realtime">Temps réel (par alerte)</SelectItem>
                                 <SelectItem value="hourly">Résumé horaire</SelectItem>
                                 <SelectItem value="daily">Résumé quotidien</SelectItem>
                               </SelectContent>
                             </Select>
                             <p className="text-xs text-gray-500">Non applicable si "Alertes Critiques Uniquement" est activé.</p>
                           </div>
                        </div>
                    </div>
                </div>
                {/* Action Buttons: Enhanced Rounding */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button variant="outline" className="rounded-lg shadow-sm hover:shadow transition-shadow duration-150">Annuler</Button>
                    <Button className="bg-green-600 hover:bg-green-700 rounded-lg shadow hover:shadow-md transition-all duration-150">Enregistrer les Notifications</Button>
                </div>
            </CardContent>
        </Card>
    );
});
NotificationSettings.displayName = 'NotificationSettings';

// --- Child Component for Security Settings --- Enhanced Rounding
const SecuritySettings = React.memo(() => {
    console.log("Rendering SecuritySettings");
    return (
        // Card: Enhanced Rounding
        <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
                <CardTitle className="text-xl font-semibold text-gray-800">Sécurité du Compte</CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                    Gérez votre mot de passe, l'authentification et les sessions actives.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Section 1: Change Password */}
                <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Mot de Passe</h3>
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="current-password">Mot de Passe Actuel</Label>
                             {/* Input: Enhanced Rounding */}
                            <Input id="current-password" type="password" className="rounded-lg shadow-sm" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="new-password">Nouveau Mot de Passe</Label>
                                 {/* Input: Enhanced Rounding */}
                                <Input id="new-password" type="password" className="rounded-lg shadow-sm" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="confirm-password">Confirmer le Mot de Passe</Label>
                                 {/* Input: Enhanced Rounding */}
                                <Input id="confirm-password" type="password" className="rounded-lg shadow-sm" />
                            </div>
                        </div>
                         {/* Button: Enhanced Rounding */}
                        <Button className="bg-green-600 hover:bg-green-700 rounded-lg shadow hover:shadow-md transition-all duration-150 mt-2">Changer le Mot de Passe</Button>
                    </div>
                </div>
                 {/* Section 2: Two-Factor Auth */}
                 <div className="border-b border-gray-100 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Authentification à Deux Facteurs (2FA)</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Ajoutez une couche de sécurité supplémentaire lors de la connexion.
                    </p>
                     {/* Container: Enhanced Rounding */}
                    <div className="flex items-center justify-between p-4 bg-gray-50/60 rounded-lg border border-gray-100 shadow-sm">
                      <div>
                        <Label className="font-medium text-gray-700">Statut 2FA</Label>
                        <p className="text-sm font-semibold text-red-600 mt-0.5">Non activé</p>
                      </div>
                       {/* Button: Enhanced Rounding */}
                      <Button variant="outline" className="rounded-lg shadow-sm hover:shadow transition-shadow duration-150">Activer 2FA</Button>
                    </div>
                  </div>
                 {/* Section 3: Active Sessions */}
                 <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Sessions Actives</h3>
                    <div className="space-y-4">
                       {/* Session Container: Enhanced Rounding */}
                       <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-200/80 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-medium text-gray-800">Session Actuelle (Ce navigateur)</p>
                            <p className="text-sm text-gray-500">Casablanca, Maroc • Chrome sur Windows</p>
                            <p className="text-xs text-gray-400 mt-1">Dernière activité: Aujourd'hui à 14:30</p>
                          </div>
                           {/* Badge: Enhanced Rounding */}
                          <Badge variant="green" className="rounded-full px-3 py-1">Actif</Badge>
                        </div>
                      </div>
                       {/* Session Container: Enhanced Rounding */}
                       <div className="p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-medium text-gray-800">Application Mobile</p>
                            <p className="text-sm text-gray-500">Casablanca, Maroc • TAQA App sur iPhone</p>
                            <p className="text-xs text-gray-400 mt-1">Dernière activité: Hier à 18:45</p>
                          </div>
                           {/* Button: Enhanced Rounding */}
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-300/50 hover:bg-red-50 rounded-lg shadow-sm hover:shadow transition-all duration-150">
                            Déconnecter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
            </CardContent>
        </Card>
    );
});
SecuritySettings.displayName = 'SecuritySettings';

// --- Child Component for Team Settings --- Enhanced Rounding
const teamMembers = [ /* Team data remains the same */ ];

const TeamSettings = React.memo(() => {
    console.log("Rendering TeamSettings");
    return (
         // Card: Enhanced Rounding
        <Card className="rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div>
                    <CardTitle className="text-xl font-semibold text-gray-800">Gestion de l'Équipe</CardTitle>
                    <CardDescription className="text-sm text-gray-500 mt-1">Gérez les membres et leurs permissions.</CardDescription>
                </div>
                 {/* Button: Enhanced Rounding */}
                <Button className="bg-green-600 hover:bg-green-700 rounded-lg shadow hover:shadow-md transition-all duration-150">Ajouter un Membre</Button>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {teamMembers.map((member) => (
                                <tr key={member.id} className="hover:bg-gray-50/70 transition-colors duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                         {/* Badge: Enhanced Rounding */}
                                        <Badge variant={member.status === "Actif" ? "green" : "gray"} className="rounded-full">
                                            {member.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                                         {/* Buttons: Enhanced Rounding */}
                                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg shadow-sm">Modifier</Button>
                                        {member.id !== 1 && (
                                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg shadow-sm">Supprimer</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
             {/* Pending Invitations Section */}
             <CardContent className="p-6 mt-0 border-t border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Invitations en Attente</h3>
                 {/* Invitation Container: Enhanced Rounding */}
                <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-200/80 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800">Hassan Chraibi</p>
                      <p className="text-sm text-gray-500">h.chraibi@taqa-predict.com • Technicien</p>
                      <p className="text-xs text-gray-400 mt-1">Invité le: 25/04/2023</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 mt-2 sm:mt-0">
                       {/* Buttons: Enhanced Rounding */}
                      <Button variant="outline" size="sm" className="rounded-lg shadow-sm hover:shadow transition-shadow duration-150">Renvoyer</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-red-300/50 hover:bg-red-50 rounded-lg shadow-sm hover:shadow transition-all duration-150">Annuler</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
        </Card>
    );
});
TeamSettings.displayName = 'TeamSettings';

// --- Main Settings Page Component ---
export default function SettingsPage() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false);

    // Memoized handlers
    const handleNotificationsEnabledChange = useCallback((checked: boolean) => { /* ... */ }, []);
    const handleEmailNotificationsChange = useCallback((checked: boolean) => { /* ... */ }, []);
    const handleSmsNotificationsChange = useCallback((checked: boolean) => { /* ... */ }, []);
    const handleCriticalAlertsOnlyChange = useCallback((checked: boolean) => { /* ... */ }, []);

    return (
        <div className="flex h-screen bg-gradient-to-br from-green-50 to-teal-50">
            <SidebarNav />
            <div className="flex-1 p-5 md:p-6 lg:p-8 overflow-y-auto scroll-smooth">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center gap-3 mb-8">
                        {/* Icon BG: Enhanced Rounding */}
                        <div className="p-2.5 bg-green-100 rounded-full shadow-sm border border-green-200/50">
                            <Wrench className="h-6 w-6 text-green-700" />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-semibold text-green-800 tracking-tight">
                            Paramètres
                        </h1>
                    </div>

                    {/* Tabs Section */}
                    <Tabs defaultValue="account" className="w-full">
                        {/* TabsList: Enhanced Rounding */}
                        <TabsList className="grid w-full grid-cols-4 mb-8 ">
                            {/* TabsTrigger: Enhanced Rounding */}
                            <TabsTrigger value="account" className="mx-2 bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium">
                                <User className="h-4 w-4" /> Compte
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="mx-2 bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium">
                                <BellRing className="h-4 w-4" /> Notifications
                            </TabsTrigger>
                            <TabsTrigger value="security" className="mx-2 bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium">
                                <Shield className="h-4 w-4" /> Sécurité
                            </TabsTrigger>
                            <TabsTrigger value="team" className="mx-2 bg-gray-300 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-700 hover:bg-gray-200/60 data-[state=inactive]:opacity-80 font-medium">
                                <Users className="h-4 w-4" /> Équipe
                            </TabsTrigger>
                        </TabsList>

                        {/* Render Memoized Components */}
                        <TabsContent value="account" className="transition-opacity duration-300 animate-in fade-in-50">
                            <AccountSettings />
                        </TabsContent>
                        <TabsContent value="notifications" className="transition-opacity duration-300 animate-in fade-in-50">
                            <NotificationSettings
                                notificationsEnabled={notificationsEnabled}
                                onNotificationsEnabledChange={handleNotificationsEnabledChange}
                                emailNotifications={emailNotifications}
                                onEmailNotificationsChange={handleEmailNotificationsChange}
                                smsNotifications={smsNotifications}
                                onSmsNotificationsChange={handleSmsNotificationsChange}
                                criticalAlertsOnly={criticalAlertsOnly}
                                onCriticalAlertsOnlyChange={handleCriticalAlertsOnlyChange}
                            />
                        </TabsContent>
                        <TabsContent value="security" className="transition-opacity duration-300 animate-in fade-in-50">
                            <SecuritySettings />
                        </TabsContent>
                        <TabsContent value="team" className="transition-opacity duration-300 animate-in fade-in-50">
                            <TeamSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}


// Placeholder/Enhanced Badge Component (Keep as is from previous version)
function Badge({ children, className = '', variant = "default", ...props }: { children: React.ReactNode, className?: string, variant?: "default" | "secondary" | "destructive" | "outline" | string }) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border shadow-sm" // Added border and shadow-sm

  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-red-200/80 bg-red-100 text-red-800",
    outline: "border-gray-300/80 bg-transparent text-gray-800",
    "green": "border-green-200/80 bg-green-100 text-green-800",
    "blue": "border-blue-200/80 bg-blue-100 text-blue-800",
    "gray": "border-gray-200/80 bg-gray-100 text-gray-700",
  }
  const combinedClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`
  return <span className={combinedClasses} {...props}>{children}</span>
}