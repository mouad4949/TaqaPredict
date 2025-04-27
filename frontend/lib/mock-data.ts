// Ce fichier n'est plus utilisé car nous recevons maintenant les données via WebSocket
// Il est conservé pour référence ou comme solution de secours

// Sample data based on the provided JSON structure
const normalData = {
  payload: {
    timestamp: new Date().toISOString(),
    metrics: {
      dc_power: 928.13,
      ac_power: 909.79,
      ambient_temp: 28.52,
      module_temp: 40.89,
      irradiation: 0.67,
      temperature_diff: 12.37,
    },
    prediction_error_scaled: 0.0991,
    anomaly_threshold_scaled: 0.1165,
    is_anomaly_flag: false,
    status: "normal",
  },
  alert: {
    level: "info",
    message: "Système Normal",
    time_indication: "Aucun risque imminent",
    details: "",
  },
}

const warningData = {
  payload: {
    timestamp: new Date().toISOString(),
    metrics: {
      dc_power: 1181.19,
      ac_power: 1152.45,
      ambient_temp: 32.3,
      module_temp: 50.83,
      irradiation: 0.8,
      temperature_diff: 18.52,
    },
    prediction_error_scaled: 0.1941,
    anomaly_threshold_scaled: 0.1165,
    status: "warning",
    predicted_values_orig: {
      AC_POWER: 711.44,
      AMBIENT_TEMPERATURE: 31.22,
      DC_POWER: 730.72,
      IRRADIATION: 0.61,
      MODULE_TEMPERATURE: 49.61,
    },
    actual_next_values_raw: {
      AC_POWER: 1079.86,
      AMBIENT_TEMPERATURE: 32.43,
      DC_POWER: 1105.17,
      IRRADIATION: 0.76,
      MODULE_TEMPERATURE: 50.34,
    },
  },
  anomaly_severity: {
    level: 2,
    severity_above_threshold: 0.0776,
    consecutive_count: 20,
  },
  alert: {
    level: "warning",
    message: "Comportement Anormal - Attention Requise (Niveau 2)",
    details:
      "Déviation: 0.0776 au-dessus du seuil (20 anomalies consécutives). Risque potentiel dans les jours à venir (< 72h).",
  },
}

const criticalData = {
  payload: {
    timestamp: new Date().toISOString(),
    metrics: {
      dc_power: 936.09,
      ac_power: 915.56,
      ambient_temp: 33.89,
      module_temp: 49.2,
      irradiation: 0.62,
      temperature_diff: 15.31,
    },
    prediction_error_scaled: 0.1192,
    anomaly_threshold_scaled: 0.1165,
    status: "critical",
    predicted_values_orig: {
      AC_POWER: 558.87,
      AMBIENT_TEMPERATURE: 32.6,
      DC_POWER: 573.04,
      IRRADIATION: 0.47,
      MODULE_TEMPERATURE: 46.89,
    },
    actual_next_values_raw: {
      AC_POWER: 719.93,
      AMBIENT_TEMPERATURE: 33.73,
      DC_POWER: 735.35,
      IRRADIATION: 0.48,
      MODULE_TEMPERATURE: 46.28,
    },
  },
  anomaly_severity: {
    level: 3,
    severity_above_threshold: 0.0027,
    consecutive_count: 25,
  },
  alert: {
    level: "critical",
    message: "ALERTE CRITIQUE - Risque de Défaillance (Niveau 3)",
    details:
      "Déviation: 0.0027 au-dessus du seuil (25 anomalies consécutives). Défaillance probable dans les 24-48h si non résolue.",
  },
}

// Generate random data within reasonable ranges
function generateRandomData(baseStatus: "normal" | "warning" | "critical") {
  let baseData

  if (baseStatus === "normal") {
    baseData = JSON.parse(JSON.stringify(normalData))
  } else if (baseStatus === "warning") {
    baseData = JSON.parse(JSON.stringify(warningData))
  } else {
    baseData = JSON.parse(JSON.stringify(criticalData))
  }

  // Update timestamp
  baseData.payload.timestamp = new Date().toISOString()

  // Add some randomness to metrics
  const metrics = baseData.payload.metrics
  metrics.dc_power = metrics.dc_power * (0.9 + Math.random() * 0.2)
  metrics.ac_power = metrics.ac_power * (0.9 + Math.random() * 0.2)
  metrics.ambient_temp = metrics.ambient_temp * (0.95 + Math.random() * 0.1)
  metrics.module_temp = metrics.module_temp * (0.95 + Math.random() * 0.1)
  metrics.irradiation = metrics.irradiation * (0.9 + Math.random() * 0.2)
  metrics.temperature_diff = metrics.module_temp - metrics.ambient_temp

  // Adjust prediction error based on status
  if (baseStatus === "normal") {
    baseData.payload.prediction_error_scaled = baseData.payload.anomaly_threshold_scaled * (0.7 + Math.random() * 0.2)
  } else if (baseStatus === "warning") {
    baseData.payload.prediction_error_scaled = baseData.payload.anomaly_threshold_scaled * (1.05 + Math.random() * 0.5)
  } else {
    baseData.payload.prediction_error_scaled = baseData.payload.anomaly_threshold_scaled * (1.1 + Math.random() * 0.3)
  }

  return baseData
}

// Generate historical data for initial load
function generateHistoricalData() {
  const data = []
  const now = new Date()

  for (let i = 19; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000)

    // Determine status - mostly normal with occasional anomalies
    let status: "normal" | "warning" | "critical" = "normal"

    // Create anomaly patterns
    if (i < 5 && i > 2) {
      // A warning period
      status = Math.random() > 0.3 ? "warning" : "normal"
    } else if (i < 2) {
      // A critical period
      status = Math.random() > 0.7 ? "critical" : "warning"
    }

    const dataPoint = generateRandomData(status)
    dataPoint.payload.timestamp = timestamp.toISOString()
    data.push(dataPoint)
  }

  return data
}

// Generate anomaly events for the log
function generateAnomalyEvents() {
  const events = []
  const now = new Date()

  // Generate 5 random anomaly events from the past 24 hours
  for (let i = 0; i < 5; i++) {
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

    // Randomly choose between warning and critical
    const status = Math.random() > 0.3 ? "warning" : "critical"
    const event = generateRandomData(status)

    event.payload.timestamp = timestamp.toISOString()
    events.push(event)
  }

  // Sort by timestamp, most recent first
  return events.sort((a, b) => new Date(b.payload.timestamp).getTime() - new Date(a.payload.timestamp).getTime())
}

// Mock data generator with methods to get initial and next data
export const mockDataGenerator = {
  getInitialData: () => {
    const historical = generateHistoricalData()
    const current = historical[historical.length - 1]
    const anomalyEvents = generateAnomalyEvents()

    return {
      current,
      historical,
      anomalyEvents,
    }
  },

  getNextDataPoint: () => {
    // 80% chance of normal, 15% warning, 5% critical
    const rand = Math.random()
    let status: "normal" | "warning" | "critical" = "normal"

    if (rand > 0.95) {
      status = "critical"
    } else if (rand > 0.8) {
      status = "warning"
    }

    return generateRandomData(status)
  },
}
