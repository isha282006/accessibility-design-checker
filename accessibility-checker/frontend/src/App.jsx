/**
 * App.jsx
 * Root component with React Router configuration and layout wrapper
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import ContrastCheckerPage from './pages/ContrastCheckerPage'
import TipsPage from './pages/TipsPage'

export default function App() {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
          duration: 4000,
        }}
      />
      <Routes>
        {/* Landing page has no sidebar */}
        <Route path="/" element={<LandingPage />} />

        {/* App pages share the sidebar layout */}
        <Route element={<Layout />}>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/contrast" element={<ContrastCheckerPage />} />
          <Route path="/tips" element={<TipsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
