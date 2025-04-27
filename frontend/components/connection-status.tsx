"use client"

import { AlertCircle, CheckCircle, WifiOff, Loader2 } from "lucide-react"

interface ConnectionStatusProps {
  status: "connecting" | "connected" | "disconnected" | "error"
  error?: Error | null
  onReconnect?: () => void
}

export function ConnectionStatus({ status, error, onReconnect }: ConnectionStatusProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
        status === "connected"
          ? "bg-green-100 text-green-800"
          : status === "connecting"
            ? "bg-blue-100 text-blue-800"
            : status === "error"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
      }`}
    >
      {status === "connected" && <CheckCircle className="h-4 w-4" />}
      {status === "connecting" && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === "disconnected" && <WifiOff className="h-4 w-4" />}
      {status === "error" && <AlertCircle className="h-4 w-4" />}

      <span>
        {status === "connected" && "Connecté au serveur"}
        {status === "connecting" && "Connexion en cours..."}
        {status === "disconnected" && "Déconnecté"}
        {status === "error" && "Erreur de connexion"}
      </span>

      {(status === "disconnected" || status === "error") && onReconnect && (
        <button
          onClick={onReconnect}
          className="ml-2 text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-0.5 rounded"
        >
          Reconnecter
        </button>
      )}

      {error && status === "error" && <span className="text-xs ml-1">({error.message})</span>}
    </div>
  )
}