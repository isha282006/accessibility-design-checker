/**
 * UploadPage.jsx
 * Image upload page with drag-and-drop zone
 * Triggers accessibility analysis on file selection
 */

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import { Upload, ImageIcon, X, Loader2, Zap } from 'lucide-react'
import { useImageAnalysis } from '../hooks/useAnalysis'
import { Button, SectionHeader } from '../components/ui'
import toast from 'react-hot-toast'

// Store result globally so dashboard page can access it
// In a real app you'd use Context or Zustand
let cachedResult = null
export const getLatestResult = () => cachedResult
export const setLatestResult = (r) => { cachedResult = r }

export default function UploadPage() {
  const navigate = useNavigate()
  const { loading, analyze } = useImageAnalysis()
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)

  // Handle file drop / selection
  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('File must be JPG, PNG, or WebP and under 10MB')
      return
    }
    const f = accepted[0]
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  // Remove selected file
  const clearFile = () => {
    setFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  // Submit for analysis
  const handleAnalyze = async () => {
    if (!file) return
    const toastId = toast.loading('Analyzing your design…')
    try {
      // Manually call API and cache result
      const FormData = window.FormData
      const fd = new FormData()
      fd.append('image', file)

      const res = await fetch('/api/analysis/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Analysis failed')

      setLatestResult({ ...data, preview })
      toast.dismiss(toastId)
      toast.success('Analysis complete!')
      navigate('/dashboard')
    } catch (err) {
      toast.dismiss(toastId)
      toast.error(err.message || 'Analysis failed')
    }
  }

  return (
    <div className="page-enter">
      <SectionHeader
        title="Upload Design"
        subtitle="Upload a PNG or JPG screenshot to check for accessibility issues"
      />

      {/* Dropzone */}
      {!file ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
          }`}
          aria-label="Upload image dropzone"
        >
          <input {...getInputProps()} aria-label="Image file input" />

          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors ${isDragActive ? 'bg-indigo-100' : 'bg-slate-100'}`}>
            {isDragActive
              ? <Upload className="w-8 h-8 text-indigo-600" />
              : <ImageIcon className="w-8 h-8 text-slate-400" />
            }
          </div>

          <h3 className="text-base font-semibold text-slate-800 mb-2">
            {isDragActive ? 'Drop your image here' : 'Drag & drop your design screenshot'}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Or click to browse files
          </p>
          <p className="text-xs text-slate-400">
            Supports PNG, JPG, WebP — Max 10MB
          </p>
        </div>
      ) : (
        /* Preview & confirm */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {/* Image preview */}
          <div className="relative bg-slate-900 flex items-center justify-center" style={{ minHeight: 300 }}>
            <img
              src={preview}
              alt="Uploaded design preview"
              className="max-h-80 max-w-full object-contain"
            />
            {/* Remove button */}
            <button
              onClick={clearFile}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-800/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* File info + actions */}
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="secondary" onClick={clearFile}>
                Change
              </Button>
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* What we check */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">What we analyze</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Color Contrast', wcag: 'WCAG 1.4.3' },
            { label: 'Text Readability', wcag: 'WCAG 1.4.6' },
            { label: 'Alt Text Detection', wcag: 'WCAG 1.1.1' },
            { label: 'Font Size Issues', wcag: 'WCAG 1.4.4' },
            { label: 'Button Visibility', wcag: 'WCAG 1.4.11' },
            { label: 'Visual Complexity', wcag: 'WCAG 1.4.8' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
              <span className="text-sm text-slate-700">{item.label}</span>
              <span className="text-xs text-slate-400 ml-auto font-mono">{item.wcag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
