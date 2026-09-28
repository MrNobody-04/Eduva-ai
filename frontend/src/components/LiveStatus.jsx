import React, { useEffect, useState } from 'react'
import { CalendarDays, Clock3, Droplets, Thermometer } from 'lucide-react'

// Kathmandu, Nepal. Open-Meteo is free and needs no API key.
const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=27.7172&longitude=85.3240' +
  '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code' +
  '&timezone=Asia%2FKathmandu'

const TZ = 'Asia/Kathmandu'

const WEATHER_LABELS = {
  0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
}

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: TZ
})
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: TZ
})

export default function LiveStatus({ compact = false }) {
  const [now, setNow] = useState(() => new Date())
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(false)

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(tick)
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(WEATHER_URL)
        if (!res.ok) throw new Error('weather ' + res.status)
        const json = await res.json()
        if (cancelled) return
        setWeather(json.current)
        setWeatherError(false)
      } catch {
        if (!cancelled) setWeatherError(true)
      }
    }
    load()
    const refresh = setInterval(load, 10 * 60 * 1000)
    return () => { cancelled = true; clearInterval(refresh) }
  }, [])

  const temp = weather ? Math.round(weather.temperature_2m) : null
  const feels = weather ? Math.round(weather.apparent_temperature) : null
  const humidity = weather ? Math.round(weather.relative_humidity_2m) : null
  const label = weather ? (WEATHER_LABELS[weather.weather_code] || 'Current conditions') : ''

  const item = 'flex items-center gap-1.5 whitespace-nowrap'
  const icon = 'w-3.5 h-3.5 text-[var(--primary)] shrink-0'

  return (
    <div
      className={`flex items-center text-xs text-[var(--text-secondary)] tabular-nums ${
        compact ? 'flex-wrap gap-x-4 gap-y-2' : 'gap-4 px-4 py-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)]'
      }`}
      aria-label="Kathmandu local date, time and weather"
    >
      <span className={item}>
        <CalendarDays className={icon} />
        <span className="font-semibold text-[var(--text-primary)]">{dateFmt.format(now)}</span>
      </span>
      <span className={item} role="timer" aria-live="off">
        <Clock3 className={icon} />
        <span className="font-semibold text-[var(--text-primary)]">{timeFmt.format(now)}</span>
        <span className="text-[var(--text-muted)]">NPT</span>
      </span>
      <span className={item} title={weatherError ? 'Live weather is temporarily unavailable' : `Feels like ${feels}°C`}>
        <Thermometer className={icon} />
        {weather ? (
          <>
            <span className="font-semibold text-[var(--text-primary)]">{temp}°C</span>
            <span className="text-[var(--text-muted)]">{label}</span>
          </>
        ) : (
          <span className="text-[var(--text-muted)]">{weatherError ? 'Weather unavailable' : 'Loading weather…'}</span>
        )}
      </span>
      {weather && (
        <span className={`${item} hidden xl:flex`}>
          <Droplets className={icon} />
          <span className="text-[var(--text-muted)]">{humidity}% humidity</span>
        </span>
      )}
    </div>
  )
}
