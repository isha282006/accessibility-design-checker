/**
 * ContrastCheckerPage.jsx
 * Interactive WCAG contrast ratio checker with color pickers
 */

import { useState, useEffect } from 'react'
import { Check, X, Contrast, RefreshCw } from 'lucide-react'
import { useContrastCheck } from '../hooks/useAnalysis'
import { Card, Button, SectionHeader } from '../components/ui'

// Predefined accessible color pair examples
const PRESETS = [
  { label: 'Black on White', c1: '#000000', c2: '#ffffff' },
  { label: 'Navy on White', c1: '#1e3a5f', c2: '#ffffff' },
  { label: 'White on Indigo', c1: '#ffffff', c2: '#4f46e5' },
  { label: 'Dark on Yellow', c1: '#1a1a1a', c2: '#fde047' },
  { label: 'Red on White', c1: '#dc2626', c2: '#ffffff' },
  { label: 'Gray on Gray', c1: '#9ca3af', c2: '#e5e7eb' },
]

// WCAG pass/fail indicator
function PassFail({ pass, label }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${pass ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
      {pass
        ? <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
        : <X className="w-4 h-4 text-red-500 flex-shrink-0" />
      }
      <span className={`text-sm font-medium ${pass ? 'text-green-800' : 'text-red-700'}`}>{label}</span>
    </div>
  )
}

export default function ContrastCheckerPage() {
  const [color1, setColor1] = useState('#1e3a5f')
  const [color2, setColor2] = useState('#ffffff')
  const { loading, result, check } = useContrastCheck()

  // Auto-check on color change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (color1.length === 7 && color2.length === 7) {
        check(color1, color2)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [color1, color2])

  const swapColors = () => {
    setColor1(color2)
    setColor2(color1)
  }

  const getRatingColor = (rating) => {
    if (rating === 'Excellent') return 'text-green-600'
    if (rating === 'Good') return 'text-green-500'
    if (rating === 'Fair') return 'text-amber-600'
    return 'text-red-500'
  }

  return (
    <div className="page-enter space-y-6">
      <SectionHeader
        title="Contrast Checker"
        subtitle="Test color combinations against WCAG AA and AAA standards"
      />

      {/* Main checker */}
      <div className="grid grid-cols-2 gap-6">
        {/* Color inputs */}
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-5">Select Colors</h3>

          <div className="space-y-5">
            {/* Color 1 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Foreground (Text)
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={color1}
                    onChange={e => setColor1(e.target.value)}
                    className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer bg-transparent"
                    aria-label="Foreground color picker"
                  />
                </div>
                <input
                  type="text"
                  value={color1}
                  onChange={e => {
                    const v = e.target.value
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor1(v)
                  }}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="#000000"
                  aria-label="Foreground hex color"
                  maxLength={7}
                />
              </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center">
              <button
                onClick={swapColors}
                className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                aria-label="Swap colors"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Color 2 */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Background
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color2}
                  onChange={e => setColor2(e.target.value)}
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 cursor-pointer bg-transparent"
                  aria-label="Background color picker"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={e => {
                    const v = e.target.value
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor2(v)
                  }}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="#ffffff"
                  aria-label="Background hex color"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Preview + results */}
        <div className="space-y-4">
          {/* Preview box */}
          <div
            className="rounded-xl border border-slate-200 overflow-hidden"
            style={{ backgroundColor: color2 }}
          >
            <div className="p-6" style={{ color: color1 }}>
              <p className="text-2xl font-bold mb-1">Heading Text (24px)</p>
              <p className="text-base mb-1">Body text at 16px — the standard minimum</p>
              <p className="text-sm">Small text at 14px — needs higher contrast ratio</p>
              <div
                className="mt-4 inline-block px-4 py-2 rounded-lg font-medium text-sm"
                style={{ backgroundColor: color1, color: color2 }}
              >
                Button Example
              </div>
            </div>
          </div>

          {/* Contrast ratio result */}
          {result && (
            <Card padding={false}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Contrast Ratio</p>
                    <p className={`text-4xl font-bold ${getRatingColor(result.rating)}`}>
                      {result.ratio}:1
                    </p>
                    <p className={`text-sm font-semibold mt-1 ${getRatingColor(result.rating)}`}>
                      {result.rating}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-full border-4 flex items-center justify-center"
                    style={{
                      borderColor: result.ratio >= 4.5 ? '#16a34a' : result.ratio >= 3 ? '#d97706' : '#dc2626',
                      backgroundColor: result.ratio >= 4.5 ? '#f0fdf4' : result.ratio >= 3 ? '#fffbeb' : '#fef2f2',
                    }}
                  >
                    <Contrast className="w-6 h-6" style={{ color: result.ratio >= 4.5 ? '#16a34a' : result.ratio >= 3 ? '#d97706' : '#dc2626' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <PassFail pass={result.wcag?.AA_normal} label="AA Normal Text" />
                  <PassFail pass={result.wcag?.AA_large} label="AA Large Text" />
                  <PassFail pass={result.wcag?.AAA_normal} label="AAA Normal Text" />
                  <PassFail pass={result.wcag?.AAA_large} label="AAA Large Text" />
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Presets */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Color Pair Presets</h3>
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => { setColor1(preset.c1); setColor2(preset.c2) }}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left"
              aria-label={`Load preset: ${preset.label}`}
            >
              {/* Color preview strip */}
              <div className="flex-shrink-0 w-10 h-8 rounded-lg overflow-hidden flex">
                <div className="flex-1" style={{ backgroundColor: preset.c1 }} />
                <div className="flex-1" style={{ backgroundColor: preset.c2 }} />
              </div>
              <span className="text-xs font-medium text-slate-700">{preset.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* WCAG reference table */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">WCAG Contrast Requirements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Level</th>
                <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Normal Text</th>
                <th className="text-left py-2 pr-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Large Text (18px+)</th>
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">UI Components</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 pr-4 font-semibold text-indigo-700">WCAG AA</td>
                <td className="py-3 pr-4 text-slate-700">4.5:1</td>
                <td className="py-3 pr-4 text-slate-700">3:1</td>
                <td className="py-3 text-slate-700">3:1</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-indigo-700">WCAG AAA</td>
                <td className="py-3 pr-4 text-slate-700">7:1</td>
                <td className="py-3 pr-4 text-slate-700">4.5:1</td>
                <td className="py-3 text-slate-700">—</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Large text: 18px regular or 14px bold. UI Components include buttons, form fields, icons.
        </p>
      </Card>
    </div>
  )
}
