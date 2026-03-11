/**
 * Layout.jsx
 * Sidebar + main content layout wrapper for all app pages
 */

import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main scrollable content area */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8 page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
