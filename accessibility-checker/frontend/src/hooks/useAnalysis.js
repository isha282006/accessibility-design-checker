/**
 * useAnalysis.js
 * Custom hook for managing analysis state and API calls
 */

import { useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = '/api'

// ─── useImageAnalysis ─────────────────────────────────────────
export function useImageAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const analyze = useCallback(async (file) => {
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const { data } = await axios.post(`${API}/analysis/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
      toast.success('Analysis complete!')
    } catch (err) {
      const msg = err.response?.data?.error || 'Analysis failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, result, error, analyze, reset: () => setResult(null) }
}

// ─── useContrastCheck ─────────────────────────────────────────
export function useContrastCheck() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const check = useCallback(async (color1, color2) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${API}/contrast/check`, { color1, color2 })
      setResult(data)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Contrast check failed')
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, result, check, reset: () => setResult(null) }
}

// ─── useReportDownload ────────────────────────────────────────
export function useReportDownload() {
  const [loading, setLoading] = useState(false)

  const download = useCallback(async (analysis, filename) => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${API}/report/generate`,
        { analysis, filename },
        { responseType: 'blob' }
      )
      // Create a download link and trigger it
      const url = URL.createObjectURL(response.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'accessibility-report.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Report downloaded!')
    } catch (err) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, download }
}
