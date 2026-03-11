/**
 * ui/index.jsx
 * Reusable UI primitives: Badge, Card, Button, Skeleton
 */

// ─── Badge ────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-slate-100 text-slate-700',
    high:    'bg-red-100 text-red-700',
    medium:  'bg-amber-100 text-amber-700',
    low:     'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    info:    'bg-indigo-100 text-indigo-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${styles[variant] || styles.default} ${className}`}>
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────
export function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${padding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:   'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-400',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost:     'text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────
export function Skeleton({ className = '' }) {
  return <div className={`shimmer rounded-lg ${className}`} />
}

// ─── SectionHeader ────────────────────────────────────────────
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'indigo', trend }) {
  const colors = {
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', value: 'text-indigo-700' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  value: 'text-green-700'  },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    value: 'text-red-700'    },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  value: 'text-amber-700'  },
  }
  const c = colors[color] || colors.indigo

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${c.icon}`} />
          </div>
        )}
      </div>
      <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
      {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-slate-400" />
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}
