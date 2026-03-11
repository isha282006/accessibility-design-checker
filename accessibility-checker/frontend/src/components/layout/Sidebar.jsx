/**
 * Sidebar.jsx
 * Fixed left navigation with links to all app sections
 */

import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Contrast,
  Lightbulb,
  Eye,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/upload',   icon: Upload,          label: 'Upload Design'   },
  { to: '/dashboard',icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/contrast', icon: Contrast,        label: 'Contrast Checker'},
  { to: '/tips',     icon: Lightbulb,       label: 'A11y Tips'       },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">A11y Checker</p>
            <p className="text-xs text-slate-400 mt-0.5">WCAG Compliance Tool</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scroll">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Tools
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* WCAG badge */}
        <div className="mt-6 px-3">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-slate-700">WCAG 2.1 Standards</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Checks against AA & AAA levels for color, typography, and interaction.
            </p>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100">
        <a
          href="/"
          className="text-xs text-slate-400 hover:text-indigo-600 transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </aside>
  )
}
