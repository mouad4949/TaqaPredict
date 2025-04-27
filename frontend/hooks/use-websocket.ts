"use client"

import { useEffect, useRef, useState, useCallback } from "react"

type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error"

interface UseWebSocketOptions {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  onMessage?: (data: any) => void
}

export function useWebSocket({
  url,
  reconnectInterval = 5000,
  maxReconnectAttempts = 10,
  onMessage,
}: UseWebSocketOptions) {
  const [status, setStatus] = useState<WebSocketStatus>("disconnected")
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [error, setError] = useState<Error | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fonction pour établir la connexion WebSocket
  const connect = useCallback(() => {
    // Nettoyage des connexions précédentes
    if (wsRef.current) {
      wsRef.current.close()
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    try {
      setStatus("connecting")

      // Création d'une nouvelle connexion WebSocket
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log("WebSocket connection established")
        setStatus("connected")
        reconnectAttemptsRef.current = 0
        setError(null)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          if (onMessage) {
            onMessage(data)
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      }

      ws.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)
        setStatus("disconnected")

        // Tentative de reconnexion
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
            connect()
          }, reconnectInterval)
        } else {
          setError(new Error(`Failed to reconnect after ${maxReconnectAttempts} attempts`))
        }
      }

      ws.onerror = (event) => {
        console.error("WebSocket error:", event)
        setStatus("error")
        setError(new Error("WebSocket connection error"))
      }

      wsRef.current = ws
    } catch (err) {
      console.error("Error creating WebSocket:", err)
      setStatus("error")
      setError(err instanceof Error ? err : new Error(String(err)))

      // Tentative de reconnexion en cas d'erreur lors de la création
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
          connect()
        }, reconnectInterval)
      }
    }
  }, [url, reconnectInterval, maxReconnectAttempts, onMessage])

  // Fonction pour envoyer un message via WebSocket
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof data === "string" ? data : JSON.stringify(data))
      return true
    }
    return false
  }, [])

  // Fonction pour se reconnecter manuellement
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    connect()
  }, [connect])

  // Établir la connexion au montage du composant
  useEffect(() => {
    if (typeof window !== "undefined") {
      connect()
    }

    // Nettoyage à la destruction du composant
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  return {
    status,
    lastMessage,
    error,
    sendMessage,
    reconnect,
  }
}
