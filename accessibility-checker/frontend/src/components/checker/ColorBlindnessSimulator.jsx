/**
 * ColorBlindnessSimulator.jsx
 * Applies CSS filter matrices to simulate color vision deficiencies
 * Supports: Protanopia, Deuteranopia, Tritanopia, Achromatopsia
 */

import { useState } from 'react'

// SVG filter matrices for each type of color vision deficiency
// Based on Machado et al. (2009) color blindness simulation
const SIMULATIONS = [
  {
    id: 'normal',
    label: 'Normal Vision',
    description: 'How most people see color',
    filter: 'none',
  },
  {
    id: 'protanopia',
    label: 'Protanopia',
    description: 'Red-blind (1% of males)',
    // Red channel severely reduced
    matrix: '0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0',
  },
  {
    id: 'deuteranopia',
    label: 'Deuteranopia',
    description: 'Green-blind (1% of males)',
    matrix: '0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0',
  },
  {
    id: 'tritanopia',
    label: 'Tritanopia',
    description: 'Blue-blind (0.01% of people)',
    matrix: '0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0',
  },
  {
    id: 'achromatopsia',
    label: 'Achromatopsia',
    description: 'Total color blindness',
    matrix: '0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0',
  },
]

export default function ColorBlindnessSimulator({ imageUrl }) {
  const [active, setActive] = useState('normal')

  const current = SIMULATIONS.find(s => s.id === active)

  // Build CSS filter string using SVG feColorMatrix
  const getFilterStyle = (sim) => {
    if (!sim.matrix || sim.id === 'normal') return {}
    return {
      filter: `url(#${sim.id}-filter)`,
    }
  }

  if (!imageUrl) {
    return (
      <div className="flex items-center justify-center h-40 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <p className="text-sm text-slate-400">Upload an image to preview simulations</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Inline SVG defs for all color matrix filters */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {SIMULATIONS.filter(s => s.matrix).map(sim => (
            <filter key={sim.id} id={`${sim.id}-filter`} colorInterpolationFilters="sRGB">
              <feColorMatrix type="matrix" values={sim.matrix} />
            </filter>
          ))}
        </defs>
      </svg>

      {/* Simulation type selector */}
      <div className="flex flex-wrap gap-2">
        {SIMULATIONS.map(sim => (
          <button
            key={sim.id}
            onClick={() => setActive(sim.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              active === sim.id
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            aria-pressed={active === sim.id}
          >
            {sim.label}
          </button>
        ))}
      </div>

      {/* Simulated image preview */}
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
        <img
          src={imageUrl}
          alt={`Design preview with ${current.label} simulation`}
          className="w-full object-contain max-h-80"
          style={getFilterStyle(current)}
        />
      </div>

      {/* Current simulation info */}
      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
        <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-indigo-800">{current.label}</p>
          <p className="text-xs text-indigo-600">{current.description}</p>
        </div>
      </div>
    </div>
  )
}
