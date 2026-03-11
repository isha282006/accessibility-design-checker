/**
 * DashboardPage.jsx
 * Main results dashboard showing score, charts, issues list,
 * color blindness simulator, and download button
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Upload, Download, Loader2,
  CheckCircle, BarChart3, Eye, Lightbulb
} from 'lucide-react'
import { getLatestResult } from './UploadPage'
import { useReportDownload } from '../hooks/useAnalysis'
import ScoreRing from '../components/checker/ScoreRing'
import IssuesList from '../components/checker/IssuesList'
import ColorBlindnessSimulator from '../components/checker/ColorBlindnessSimulator'
import { SeverityPieChart, IssueTypeBarChart } from '../components/dashboard/Charts'
import { Card, Button, StatCard, SectionHeader, Badge, EmptyState } from '../components/ui'
import { AlertCircle, TrendingDown } from 'lucide-react'

export default function DashboardPage() {
  const [result, setResult] = useState(null)
  const { loading: pdfLoading, download } = useReportDownload()

  // Load cached result from upload page
  useEffect(() => {
    const r = getLatestResult()
    if (r) setResult(r)
  }, [])

  // If no analysis yet, prompt to upload
  if (!result) {
    return (
      <div className="page-enter">
        <SectionHeader title="Dashboard" subtitle="Your accessibility analysis results" />
        <Card>
          <EmptyState
            icon={Upload}
            title="No analysis yet"
            description="Upload a design screenshot to see your accessibility score, issue breakdown, and improvement suggestions."
            action={
              <Link to="/upload">
                <Button>
                  <Upload className="w-4 h-4" />
                  Upload a Design
                </Button>
              </Link>
            }
          />
        </Card>
      </div>
    )
  }

  const { analysis, filename, preview, fileUrl } = result

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <SectionHeader
        title="Accessibility Dashboard"
        subtitle={`Analysis of: ${filename || 'Uploaded design'}`}
        action={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => download(analysis, filename)}
              disabled={pdfLoading}
            >
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download Report
            </Button>
            <Link to="/upload">
              <Button variant="secondary">
                <Upload className="w-4 h-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        }
      />

      {/* Score + Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {/* Score card */}
        <Card className="col-span-1 flex flex-col items-center justify-center py-6">
          <ScoreRing score={analysis.score} size={140} />
          <p className="text-xs text-slate-400 mt-3 font-medium text-center">Accessibility Score</p>
        </Card>

        {/* Stat cards */}
        <div className="col-span-3 grid grid-cols-3 gap-4">
          <StatCard
            label="Total Issues"
            value={analysis.totalIssues}
            icon={AlertTriangle}
            color={analysis.totalIssues > 4 ? 'red' : analysis.totalIssues > 2 ? 'amber' : 'green'}
          />
          <StatCard
            label="High Severity"
            value={analysis.severityCounts?.high || 0}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            label="Needs Attention"
            value={analysis.severityCounts?.medium || 0}
            icon={TrendingDown}
            color="amber"
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            Issues by Type
          </h3>
          <IssueTypeBarChart issueCounts={analysis.issueCounts} />
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Issues by Severity
          </h3>
          <SeverityPieChart severityCounts={analysis.severityCounts} />
        </Card>
      </div>

      {/* Top colors extracted */}
      {analysis.topColors?.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Detected Color Palette</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {analysis.topColors.map((color) => (
              <div key={color} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                <div
                  className="w-5 h-5 rounded-md border border-slate-200 flex-shrink-0"
                  style={{ backgroundColor: color }}
                  aria-label={`Color: ${color}`}
                />
                <span className="text-xs font-mono text-slate-600">{color}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detected Issues */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Detected Issues
          <Badge variant={analysis.totalIssues > 0 ? 'high' : 'success'} className="ml-auto">
            {analysis.totalIssues} found
          </Badge>
        </h3>
        <IssuesList issues={analysis.issues} />
      </Card>

      {/* AI Suggestions */}
      {analysis.suggestions?.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Improvement Suggestions
          </h3>
          <div className="space-y-3">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-0.5">{s.title}</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Color Blindness Simulator */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4 text-purple-500" />
          Color Blindness Simulation
        </h3>
        <ColorBlindnessSimulator imageUrl={preview || (fileUrl ? `http://localhost:3001${fileUrl}` : null)} />
      </Card>

      {/* Image Stats */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Image Analysis Stats</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Avg Luminance', value: analysis.stats?.avgLuminance },
            { label: 'Low Contrast %', value: `${analysis.stats?.lowContrastPercent}%` },
            { label: 'Dark Pixels %', value: `${analysis.stats?.darkPercent}%` },
            { label: 'Color Variety', value: analysis.stats?.colorVariety },
          ].map(s => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
