/**
 * ScoreRing.jsx
 * Animated circular score indicator
 */

import { useEffect, useState } from 'react'

export default function ScoreRing({ score = 0, size = 160 }) {
  const [displayed, setDisplayed] = useState(0)

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (displayed / 100) * circumference

  // Score color thresholds
  const color = score >= 80 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626'
  const label = score >= 80 ? 'Great' : score >= 50 ? 'Needs Work' : 'Poor'

  // Animate score counter on mount
  useEffect(() => {
    let frame
    let start = null
    const duration = 1000

    const animate = (timestamp) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setDisplayed(Math.round(progress * score))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`Accessibility score: ${score} out of 100`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="10"
        />
        {/* Foreground progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
        {/* Score text */}
        <text
          x="50%"
          y="46%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size * 0.2}
          fontWeight="700"
          fill={color}
          fontFamily="DM Sans, sans-serif"
        >
          {displayed}
        </text>
        <text
          x="50%"
          y="66%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize={size * 0.1}
          fill="#94a3b8"
          fontFamily="DM Sans, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span className="text-sm font-semibold" style={{ color }}>{label}</span>
    </div>
  )
}
