// components/AnomalyEventLog.tsx
import React from 'react';

// Interface décrivant la structure attendue d'un événement
// Basée sur l'objet msg de Node-RED { payload: ..., alert: ... }
interface AnomalyEvent {
  payload: {
    timestamp: string;
    status: string;
    prediction_error_scaled: number;
    anomaly_threshold_scaled: number;
    // Ajouter d'autres champs de payload si nécessaire
  };
  // L'objet alert est au même niveau que payload, et potentiellement optionnel
  alert?: {
    level: string;
    message: string;
    time_indication?: string; // Le champ qu'on veut afficher
    details?: string;
  };
  // L'objet anomaly_severity (si présent)
  anomaly_severity?: {
    level: number;
    // Ajouter d'autres champs si nécessaire
  };
  _msgid?: string; // Id unique du message Node-RED
}

// Props attendues par le composant
interface AnomalyEventLogProps {
  events: AnomalyEvent[]; // Utiliser l'interface définie
}

export function AnomalyEventLog({ events }: AnomalyEventLogProps) {
  // Gestion du cas où il n'y a pas d'événements
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        {/* ... SVG et message "Aucune anomalie" ... */}
         <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" > <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>
        <p className="text-gray-500">Aucune anomalie détectée récemment</p>
      </div>
    );
  }

  // Fonction pour formater le timestamp (peut être externalisée si utilisée ailleurs)
  const formatTimestamp = (isoString: string | undefined): string => {
      if (!isoString) return 'Timestamp manquant';
      try {
          const date = new Date(isoString);
          return date.toLocaleString([], {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: '2-digit', // Ajout des secondes pour plus de précision
          });
      } catch {
          return isoString; // Retourner la chaîne originale en cas d'erreur
      }
  };

  // Fonction pour déterminer les classes de style basé sur l'alerte/statut
  const getStyling = (event: AnomalyEvent): { borderClass: string, icon: JSX.Element } => {
      const level = event.alert?.level?.toLowerCase();
      const status = event.payload?.status?.toLowerCase();

      if (level === 'critical' || status === 'critical') {
          return {
              borderClass: 'bg-red-50 border-l-red-500',
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          };
      }
      if (level === 'moderate' || status === 'moderate') {
           return { // Style pour moderate (similaire à warning ou différent ?)
               borderClass: 'bg-orange-50 border-l-orange-500', // Ex: Orange
               icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> // Ex: Icône différente
           };
       }
      if (level === 'warning' || status === 'warning') {
          return {
              borderClass: 'bg-yellow-50 border-l-yellow-500',
              icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          };
      }
      // Cas par défaut (par exemple, si status est 'info' ou non reconnu)
       return {
           borderClass: 'bg-gray-50 border-l-gray-400',
           icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
       };
  };


  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2"> {/* Léger ajustement espace/padding */}
      {events.map((event) => {
        const key = event._msgid || `anomaly-${event.payload?.timestamp}-${Math.random()}`; // Clé plus robuste
        const { borderClass, icon } = getStyling(event);

        return (
          <div
            key={key}
            className={`p-3 rounded-lg shadow-sm border-l-4 ${borderClass}`} // Utilise la classe déterminée
          >
            <div className="flex items-start gap-3">
              {icon} {/* Affiche l'icône déterminée */}

              <div className="space-y-1 flex-1">
                {/* Ligne Titre / Timestamp */}
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm"> {/* Taille police ajustée */}
                    {/* Priorité au message d'alerte */}
                    {event.alert?.message || `Anomalie (Statut: ${event.payload?.status || 'N/A'})`}
                  </p>
                  <time className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {formatTimestamp(event.payload?.timestamp)}
                  </time>
                </div>

                {/* --- AFFICHAGE DE TIME_INDICATION AJOUTÉ ICI --- */}
                {event.alert?.time_indication && (
                  <p className="text-xs text-gray-600 italic mt-1"> {/* Taille et style ajustés */}
                    <span className="font-medium not-italic">Estimation:</span> {event.alert.time_indication}
                  </p>
                )}
                {/* --- FIN DE L'AJOUT --- */}


                {/* Affichage des détails */}
                {event.alert?.details && (
                  <p className="text-sm text-gray-600 mt-1">{event.alert.details}</p>
                )}

                {/* Affichage des infos techniques */}
                
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}