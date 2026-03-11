/**
 * LandingPage.jsx
 * Marketing landing page explaining the tool's features
 */

import { Link } from 'react-router-dom'
import {
  Eye, Zap, BarChart3, Contrast, Lightbulb,
  CheckCircle, ArrowRight, Shield, Accessibility
} from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Upload & Analyze',
    description: 'Upload PNG or JPG screenshots and get instant WCAG compliance analysis.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Zap,
    title: 'AI-Powered Suggestions',
    description: 'Get actionable recommendations to fix every accessibility issue detected.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Visual Dashboard',
    description: 'See your accessibility score and issue breakdown with clear charts.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Contrast,
    title: 'Contrast Checker',
    description: 'Test any two colors against WCAG AA and AAA standards instantly.',
    color: 'bg-pink-50 text-pink-600',
  },
  {
    icon: Eye,
    title: 'Color Blind Preview',
    description: 'Simulate how your design looks with protanopia, deuteranopia, and more.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Lightbulb,
    title: 'Accessibility Tips',
    description: 'Curated WCAG guidelines and best practices for accessible design.',
    color: 'bg-cyan-50 text-cyan-600',
  },
]

const stats = [
  { value: '1B+', label: 'People with disabilities worldwide' },
  { value: '96.3%', label: 'Of top websites fail WCAG 2.1' },
  { value: '4.5:1', label: 'Minimum contrast ratio (WCAG AA)' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900">A11y Checker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contrast" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Contrast
            </Link>
            <Link to="/tips" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Tips
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <Shield className="w-3.5 h-3.5" />
          WCAG 2.1 Compliance Checker
        </div>

        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
          Make your designs
          <br />
          <span className="text-indigo-600">accessible to everyone.</span>
        </h1>

        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your design screenshots and get instant feedback on color contrast,
          readability, and WCAG compliance. Build products that everyone can use.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
          >
            Analyze a Design
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contrast"
            className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Contrast className="w-4 h-4 text-slate-400" />
            Check Contrast
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-slate-50 border-y border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Everything you need</h2>
            <p className="text-slate-500">Comprehensive accessibility auditing in one tool</p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">How it works</h2>
          <p className="text-slate-500">Three steps to a more accessible design</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Upload', desc: 'Drop a PNG or JPG screenshot of your design' },
            { step: '02', title: 'Analyze', desc: 'Our tool scans for color contrast, readability, and more' },
            { step: '03', title: 'Fix', desc: 'Get specific suggestions and download a full PDF report' },
          ].map((s) => (
            <div key={s.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-2xl mx-auto text-center px-6">
          <Accessibility className="w-10 h-10 text-indigo-200 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Start building accessible designs today</h2>
          <p className="text-indigo-200 mb-8">Free to use. No account required.</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Analyze Your Design
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-slate-400">
          <span>© 2024 Accessibility Design Checker</span>
          <span>Built with WCAG 2.1 standards</span>
        </div>
      </footer>
    </div>
  )
}
