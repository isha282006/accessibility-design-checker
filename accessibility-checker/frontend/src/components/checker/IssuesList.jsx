/**
 * IssuesList.jsx
 * Renders detected accessibility issues with severity badges and suggestions
 */

import { AlertTriangle, Info, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../ui'

// Icon per severity level
const severityIcon = {
  high:   <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />,
  medium: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />,
  low:    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />,
}

const severityVariant = { high: 'high', medium: 'medium', low: 'low' }

export default function IssuesList({ issues = [] }) {
  const [expanded, setExpanded] = useState(null)

  if (issues.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-8">
        No issues detected. Great job! 🎉
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {issues.map((issue, i) => (
        <li key={i} className="border border-slate-200 rounded-lg overflow-hidden">
          {/* Issue header — clickable to expand */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            onClick={() => setExpanded(expanded === i ? null : i)}
            aria-expanded={expanded === i}
          >
            {severityIcon[issue.severity] || severityIcon.low}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-800">{issue.type}</span>
                <Badge variant={severityVariant[issue.severity]}>{issue.severity}</Badge>
                {issue.wcag && (
                  <span className="text-xs text-slate-400 font-mono">{issue.wcag}</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{issue.description}</p>
            </div>
            {expanded === i
              ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            }
          </button>

          {/* Expanded detail with suggestion */}
          {expanded === i && (
            <div className="px-4 pb-4 pt-1 bg-slate-50 border-t border-slate-100">
              <p className="text-sm text-slate-600 mb-3">{issue.description}</p>
              <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <span className="text-green-600 text-sm font-semibold flex-shrink-0">Fix:</span>
                <p className="text-sm text-green-800">{issue.suggestion}</p>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
