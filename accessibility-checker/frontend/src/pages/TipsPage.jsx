/**
 * TipsPage.jsx
 * Curated WCAG accessibility tips and best practices
 */

import { useState } from 'react'
import { Lightbulb, Eye, Type, MousePointer, Layers, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Card, SectionHeader, Badge } from '../components/ui'

const CATEGORIES = [
  {
    id: 'color',
    icon: Eye,
    label: 'Color & Contrast',
    color: 'bg-purple-50 text-purple-600',
    tips: [
      {
        title: 'Minimum contrast ratio of 4.5:1',
        detail: 'Normal text (under 18px) must have a contrast ratio of at least 4.5:1 against its background. Use WCAG Level AA as your baseline.',
        wcag: 'WCAG 1.4.3',
        level: 'AA',
      },
      {
        title: "Don't rely on color alone",
        detail: "Color should not be the only means of conveying information. Use labels, patterns, icons, or text alongside color cues. Colorblind users can't distinguish red vs green.",
        wcag: 'WCAG 1.4.1',
        level: 'A',
      },
      {
        title: 'Large text has a lower threshold (3:1)',
        detail: 'Text that is 18px regular or 14px bold qualifies as large text and needs a 3:1 ratio. This gives designers more flexibility for headings.',
        wcag: 'WCAG 1.4.3',
        level: 'AA',
      },
      {
        title: 'Test with color blindness simulators',
        detail: 'Around 8% of males have some form of color vision deficiency. Run your designs through protanopia and deuteranopia simulations regularly.',
        wcag: 'WCAG 1.4.1',
        level: 'A',
      },
    ],
  },
  {
    id: 'typography',
    icon: Type,
    label: 'Typography',
    color: 'bg-blue-50 text-blue-600',
    tips: [
      {
        title: 'Minimum body font size of 16px',
        detail: 'Fonts under 16px are difficult to read for users with low vision. Use relative units (rem) rather than fixed pixels so users can scale text in their browser.',
        wcag: 'WCAG 1.4.4',
        level: 'AA',
      },
      {
        title: 'Line height should be at least 1.5',
        detail: 'Sufficient line height (line-height: 1.5) improves readability, especially for users with dyslexia or cognitive disabilities.',
        wcag: 'WCAG 1.4.12',
        level: 'AA',
      },
      {
        title: 'Avoid justified text',
        detail: "Fully justified text creates uneven word spacing that can make reading difficult. Use left-aligned text for most content.",
        wcag: 'WCAG 1.4.8',
        level: 'AAA',
      },
      {
        title: 'Letter spacing and paragraph spacing',
        detail: 'Users with dyslexia often increase letter spacing. Ensure your layout does not break when text spacing is increased (no overflow-hidden truncation).',
        wcag: 'WCAG 1.4.12',
        level: 'AA',
      },
    ],
  },
  {
    id: 'interaction',
    icon: MousePointer,
    label: 'Interactions & Focus',
    color: 'bg-green-50 text-green-600',
    tips: [
      {
        title: 'Visible focus indicators are required',
        detail: 'Every focusable element must have a visible focus ring. Never use "outline: none" without providing an alternative. Focus rings must have 3:1 contrast with the surrounding colors.',
        wcag: 'WCAG 2.4.7',
        level: 'AA',
      },
      {
        title: 'Touch targets must be at least 44×44px',
        detail: "Small tap targets cause errors for users with motor impairments. The minimum recommended touch target is 44×44 CSS pixels (Apple's HIG recommends 48×48).",
        wcag: 'WCAG 2.5.5',
        level: 'AAA',
      },
      {
        title: 'Provide keyboard navigation',
        detail: 'All functionality must be accessible via keyboard alone (Tab, Shift+Tab, Enter, Space, arrow keys). Test by unplugging your mouse.',
        wcag: 'WCAG 2.1.1',
        level: 'A',
      },
      {
        title: 'Skip navigation links',
        detail: 'Provide a "Skip to main content" link as the first focusable element. This lets keyboard users bypass repetitive navigation on every page load.',
        wcag: 'WCAG 2.4.1',
        level: 'A',
      },
    ],
  },
  {
    id: 'images',
    icon: Layers,
    label: 'Images & Media',
    color: 'bg-amber-50 text-amber-600',
    tips: [
      {
        title: 'All informative images need alt text',
        detail: 'Every <img> that conveys information must have an alt attribute describing the content. Avoid phrases like "image of" — just describe what matters.',
        wcag: 'WCAG 1.1.1',
        level: 'A',
      },
      {
        title: 'Decorative images use empty alt=""',
        detail: 'Images used purely for decoration should have alt="" (empty string). This tells screen readers to skip them entirely.',
        wcag: 'WCAG 1.1.1',
        level: 'A',
      },
      {
        title: 'Complex images need extended descriptions',
        detail: 'Charts, graphs, and diagrams need descriptions that convey the same information. Use figcaption, aria-describedby, or provide a text equivalent.',
        wcag: 'WCAG 1.1.1',
        level: 'A',
      },
      {
        title: 'Captions for videos are mandatory',
        detail: 'All prerecorded videos with audio must have synchronized captions (not just auto-generated). Live video must have real-time captions at WCAG AAA.',
        wcag: 'WCAG 1.2.2',
        level: 'A',
      },
    ],
  },
]

function TipAccordion({ tip }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-sm font-medium text-slate-800">{tip.title}</span>
          <Badge variant="info" className="text-xs">{tip.level}</Badge>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">{tip.wcag}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-amber-50 border-t border-amber-100">
          <p className="text-sm text-slate-700 leading-relaxed">{tip.detail}</p>
          <p className="text-xs text-slate-400 mt-2 font-mono">{tip.wcag}</p>
        </div>
      )}
    </div>
  )
}

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState('color')
  const category = CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="page-enter space-y-6">
      <SectionHeader
        title="Accessibility Tips"
        subtitle="WCAG 2.1 best practices and guidelines for accessible design"
      />

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            aria-pressed={activeCategory === cat.id}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tips list */}
      {category && (
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-9 h-9 rounded-xl ${category.color} flex items-center justify-center`}>
              <category.icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">{category.label}</h3>
              <p className="text-xs text-slate-400">{category.tips.length} guidelines</p>
            </div>
          </div>
          <div className="space-y-2">
            {category.tips.map((tip, i) => (
              <TipAccordion key={i} tip={tip} />
            ))}
          </div>
        </Card>
      )}

      {/* Quick reference */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Reference: WCAG Levels</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              level: 'Level A',
              color: 'bg-red-50 border-red-200 text-red-800',
              desc: 'Minimum. Must meet for basic accessibility. Failure creates barriers for some users.',
            },
            {
              level: 'Level AA',
              color: 'bg-amber-50 border-amber-200 text-amber-800',
              desc: 'Standard target. Most laws and regulations require WCAG 2.1 AA compliance.',
            },
            {
              level: 'Level AAA',
              color: 'bg-green-50 border-green-200 text-green-800',
              desc: 'Enhanced. Highest level. Not required for all content but ideal for maximum inclusion.',
            },
          ].map(l => (
            <div key={l.level} className={`rounded-xl border p-4 ${l.color}`}>
              <p className="font-bold mb-1">{l.level}</p>
              <p className="text-xs leading-relaxed opacity-90">{l.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* External resources */}
      <Card>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Further Reading</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'WCAG 2.1 Guidelines', url: 'https://www.w3.org/TR/WCAG21/' },
            { label: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' },
            { label: 'A11y Project Checklist', url: 'https://www.a11yproject.com/checklist/' },
            { label: 'MDN Accessibility Docs', url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility' },
          ].map(r => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 text-sm text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
            >
              {r.label}
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 flex-shrink-0 ml-2" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
