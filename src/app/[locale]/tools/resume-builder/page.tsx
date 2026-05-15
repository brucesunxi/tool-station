'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

interface Experience {
  company: string; role: string; start: string; end: string; desc: string
}
interface Education {
  school: string; degree: string; field: string; start: string; end: string
}

function emptyExp(): Experience { return { company: '', role: '', start: '', end: '', desc: '' } }
function emptyEdu(): Education { return { school: '', degree: '', field: '', start: '', end: '' } }

export default function ResumeBuilderPage() {
  const t = useTranslations('tools.resume-builder')
  const ct = useTranslations('common')

  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [summary, setSummary] = useState('')
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState<Experience[]>([emptyExp()])
  const [education, setEducation] = useState<Education[]>([emptyEdu()])
  const [showPreview, setShowPreview] = useState(false)

  const updateExp = (i: number, field: keyof Experience, value: string) => {
    const copy = [...experience]; copy[i] = { ...copy[i], [field]: value }; setExperience(copy)
  }
  const addExp = () => setExperience([...experience, emptyExp()])
  const removeExp = (i: number) => experience.length > 1 && setExperience(experience.filter((_, idx) => idx !== i))

  const updateEdu = (i: number, field: keyof Education, value: string) => {
    const copy = [...education]; copy[i] = { ...copy[i], [field]: value }; setEducation(copy)
  }
  const addEdu = () => setEducation([...education, emptyEdu()])
  const removeEdu = (i: number) => education.length > 1 && setEducation(education.filter((_, idx) => idx !== i))

  const handlePrint = () => {
    const pw = window.open('', '_blank')
    if (!pw) return
    pw.document.write(`<html><head><title>Resume - ${name || 'Untitled'}</title><style>
      body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 40px; color: #333; }
      h1 { font-size: 28px; margin-bottom: 4px; color: #1a1a1a; }
      .title { font-size: 16px; color: #2563eb; margin-bottom: 8px; }
      .contact { font-size: 13px; color: #666; margin-bottom: 20px; }
      .section-title { font-size: 16px; font-weight: 700; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin-top: 24px; margin-bottom: 12px; color: #1a1a1a; }
      .summary { font-size: 14px; line-height: 1.6; margin-bottom: 8px; color: #444; }
      .entry { margin-bottom: 14px; }
      .entry-title { font-weight: 600; font-size: 14px; }
      .entry-sub { font-size: 13px; color: #2563eb; }
      .entry-date { font-size: 12px; color: #888; float: right; }
      .entry-desc { font-size: 13px; line-height: 1.5; color: #444; margin-top: 4px; }
      .skills { font-size: 13px; color: #444; line-height: 1.8; }
      @media print { body { margin: 0; padding: 20px 40px; } }
    </style></head><body>`)
    pw.document.write(`<h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>`)
    if (title) pw.document.write(`<div class="title">${title}</div>`)
    pw.document.write(`<div class="contact">${[email, phone, location].filter(Boolean).join(' | ')}</div>`)
    if (summary) pw.document.write(`<div class="section-title">Professional Summary</div><div class="summary">${summary}</div>`)
    if (experience.some(e => e.role)) {
      pw.document.write(`<div class="section-title">Experience</div>`)
      experience.filter(e => e.role).forEach(e => {
        pw.document.write(`<div class="entry"><div class="entry-title">${e.role} at ${e.company}<span class="entry-date">${e.start}${e.end ? ' - ' + e.end : ''}</span></div><div class="entry-desc">${e.desc}</div></div>`)
      })
    }
    if (education.some(e => e.school)) {
      pw.document.write(`<div class="section-title">Education</div>`)
      education.filter(e => e.school).forEach(e => {
        pw.document.write(`<div class="entry"><div class="entry-title">${e.degree} in ${e.field}<span class="entry-date">${e.start}${e.end ? ' - ' + e.end : ''}</span></div><div class="entry-sub">${e.school}</div></div>`)
      })
    }
    if (skills) pw.document.write(`<div class="section-title">Skills</div><div class="skills">${skills}</div>`)
    pw.document.write('</body></html>')
    pw.document.close()
    pw.focus()
    pw.print()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Resume Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-5">
          {/* Personal */}
          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">Personal Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Input label="Full Name" value={name} onChange={setName} placeholder="John Doe" /></div>
              <div className="col-span-2"><Input label="Professional Title" value={title} onChange={setTitle} placeholder="Senior Software Engineer" /></div>
              <Input label="Email" value={email} onChange={setEmail} placeholder="john@email.com" />
              <Input label="Phone" value={phone} onChange={setPhone} placeholder="+1 555-1234" />
              <div className="col-span-2"><Input label="Location" value={location} onChange={setLocation} placeholder="San Francisco, CA" /></div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">Professional Summary</h2>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={4}
              placeholder="Brief overview of your experience and career goals..."
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* Experience */}
          <div className="p-4 border rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Experience</h2>
              <button onClick={addExp} className="text-xs text-blue-600 hover:underline">+ Add</button>
            </div>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg relative">
                {experience.length > 1 && <button onClick={() => removeExp(i)} className="absolute top-2 right-2 text-xs text-red-500 hover:underline">Remove</button>}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="col-span-2"><Input label="Company" value={exp.company} onChange={v => updateExp(i, 'company', v)} /></div>
                  <div className="col-span-2"><Input label="Role" value={exp.role} onChange={v => updateExp(i, 'role', v)} /></div>
                  <Input label="Start" value={exp.start} onChange={v => updateExp(i, 'start', v)} placeholder="2020" />
                  <Input label="End" value={exp.end} onChange={v => updateExp(i, 'end', v)} placeholder="Present" />
                </div>
                <textarea value={exp.desc} onChange={e => updateExp(i, 'desc', e.target.value)} rows={2} placeholder="Describe your responsibilities and achievements..."
                  className="w-full p-2 border rounded-lg text-xs dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="p-4 border rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Education</h2>
              <button onClick={addEdu} className="text-xs text-blue-600 hover:underline">+ Add</button>
            </div>
            {education.map((edu, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg relative">
                {education.length > 1 && <button onClick={() => removeEdu(i)} className="absolute top-2 right-2 text-xs text-red-500 hover:underline">Remove</button>}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="col-span-2"><Input label="School" value={edu.school} onChange={v => updateEdu(i, 'school', v)} /></div>
                  <Input label="Degree" value={edu.degree} onChange={v => updateEdu(i, 'degree', v)} placeholder="B.S." />
                  <Input label="Field" value={edu.field} onChange={v => updateEdu(i, 'field', v)} placeholder="Computer Science" />
                  <Input label="Start" value={edu.start} onChange={v => updateEdu(i, 'start', v)} placeholder="2016" />
                  <Input label="End" value={edu.end} onChange={v => updateEdu(i, 'end', v)} placeholder="2020" />
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">Skills</h2>
            <textarea value={skills} onChange={e => setSkills(e.target.value)} rows={3}
              placeholder="JavaScript, React, TypeScript, Node.js, Python..."
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-400 mt-1">Comma-separated list</p>
          </div>

          <button onClick={() => setShowPreview(!showPreview)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {showPreview ? 'Hide Preview' : 'Preview & Download'}
          </button>
          {showPreview && (
            <button onClick={handlePrint}
              className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Download PDF
            </button>
          )}
        </div>

        {/* Right: Preview */}
        <div>
          {showPreview ? (
            <div id="resume-preview" className="border rounded-xl bg-white dark:bg-gray-800 p-8 shadow-sm text-gray-900 dark:text-gray-100">
              <h1 className="text-2xl font-bold mb-1">{name || 'Your Name'}</h1>
              {title && <p className="text-blue-600 text-sm mb-1">{title}</p>}
              <p className="text-xs text-gray-500 mb-4">{[email, phone, location].filter(Boolean).join(' | ') || 'email | phone | location'}</p>

              {summary && <><hr className="mb-3" /><p className="text-sm leading-relaxed mb-4">{summary}</p></>}

              {experience.some(e => e.role) && <><hr className="mb-3" /><h2 className="font-bold text-sm mb-2 text-blue-700">Experience</h2>
                {experience.filter(e => e.role).map((e, i) => (
                  <div key={i} className="mb-3"><p className="font-semibold text-sm">{e.role} <span className="font-normal text-gray-500">at {e.company}</span><span className="float-right text-xs text-gray-400">{e.start}{e.end ? ` - ${e.end}` : ''}</span></p>
                    {e.desc && <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{e.desc}</p>}</div>
                ))}</>}

              {education.some(e => e.school) && <><hr className="mb-3" /><h2 className="font-bold text-sm mb-2 text-blue-700">Education</h2>
                {education.filter(e => e.school).map((e, i) => (
                  <div key={i} className="mb-2"><p className="font-semibold text-sm">{e.degree} in {e.field}<span className="float-right text-xs text-gray-400">{e.start}{e.end ? ` - ${e.end}` : ''}</span></p>
                    <p className="text-xs text-gray-500">{e.school}</p></div>
                ))}</>}

              {skills && <><hr className="mb-3" /><h2 className="font-bold text-sm mb-2 text-blue-700">Skills</h2>
                <p className="text-sm text-gray-700 dark:text-gray-300">{skills}</p></>}
            </div>
          ) : (
            <div className="sticky top-24 min-h-[500px] border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50">
              Fill in your details and click Preview & Download
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 pt-8 border-t prose dark:prose-invert max-w-none">
        <h2>{t('howto.heading')}</h2>
        <ol>
          {(t.raw('howto.steps') as string[]).map((step, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: step }} />
          ))}
        </ol>
        <h2>{t('tips.heading')}</h2>
        <ul>
          {(t.raw('tips.items') as string[]).map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </ul>
        <h2>{t('faq.heading')}</h2>
        <div className="space-y-4">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-0.5 text-gray-500">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}
