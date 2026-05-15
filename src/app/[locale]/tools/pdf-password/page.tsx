'use client'

import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import AdBanner from '@/components/AdBanner'

type Mode = 'lock' | 'unlock'

// ---------------------------------------------------------------------------
// PDF encryption / decryption helpers  (RC4 + MD5, per PDF 1.7 spec)
// ---------------------------------------------------------------------------

function rc4(key: Uint8Array, data: Uint8Array): Uint8Array {
  const s = new Uint8Array(256)
  for (let i = 0; i < 256; i++) s[i] = i
  for (let i = 0, j = 0; i < 256; i++) {
    j = (j + s[i] + key[i % key.length]) & 0xff; [s[i], s[j]] = [s[j], s[i]]
  }
  const out = new Uint8Array(data.length)
  for (let i = 0, x = 0, y = 0; i < data.length; i++) {
    x = (x + 1) & 0xff; y = (y + s[x]) & 0xff; [s[x], s[y]] = [s[y], s[x]]
    out[i] = data[i] ^ s[(s[x] + s[y]) & 0xff]
  }
  return out
}

function strToBytes(s: string): Uint8Array {
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

function bytesToHex(b: Uint8Array): string {
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(h: string): Uint8Array {
  const clean = h.replace(/[^0-9a-fA-F]/g, '')
  const out = new Uint8Array(clean.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  return out
}

function md5(msg: Uint8Array): Uint8Array {
  const add32 = (a: number, b: number) => (a + b) >>> 0
  const rotl = (v: number, c: number) => ((v << c) | (v >>> (32 - c))) >>> 0
  const F = (x: number, y: number, z: number) => (x & y) | (~x & z)
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z)
  const H = (x: number, y: number, z: number) => x ^ y ^ z
  const I = (x: number, y: number, z: number) => y ^ (x | ~z)
  const T: number[] = []
  for (let i = 1; i <= 64; i++) T[i] = add32(Math.floor(Math.abs(Math.sin(i)) * 0x100000000), 0)

  const bits = msg.length * 8
  const paddedLen = (((msg.length + 8 + 64) >>> 6) + 1) << 6
  const padded = new Uint8Array(paddedLen)
  padded.set(msg)
  padded[msg.length] = 0x80
  new DataView(padded.buffer).setUint32(paddedLen - 8, bits, true)
  new DataView(padded.buffer).setUint32(paddedLen - 4, 0, true)

  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476
  const gU32 = (arr: Uint8Array, off: number) => new DataView(arr.buffer).getUint32(off, true)

  for (let i = 0; i < paddedLen; i += 64) {
    const M: number[] = []
    for (let j = 0; j < 16; j++) M[j] = gU32(padded, i + j * 4)
    let A = h0, B = h1, C = h2, D = h3

    const round = (f: (x: number, y: number, z: number) => number, k: number, shift: number, tval: number) => {
      const temp = add32(rotl(add32(A + f(B, C, D) + k + tval, 0), shift), B) >>> 0
      A = D; D = C; C = B; B = temp
    }

    const s1 = [7, 12, 17, 22], s2 = [5, 9, 14, 20], s3 = [4, 11, 16, 23], s4 = [6, 10, 15, 21]
    for (let j = 0; j < 16; j++) round(F, M[j], s1[j % 4], T[j + 1])
    for (let j = 0; j < 16; j++) round(G, M[(5 * j + 1) % 16], s2[j % 4], T[j + 17])
    for (let j = 0; j < 16; j++) round(H, M[(3 * j + 5) % 16], s3[j % 4], T[j + 33])
    for (let j = 0; j < 16; j++) round(I, M[(7 * j) % 16], s4[j % 4], T[j + 49])

    h0 = add32(h0, A); h1 = add32(h1, B); h2 = add32(h2, C); h3 = add32(h3, D)
  }

  const out = new Uint8Array(16)
  const dv = new DataView(out.buffer)
  dv.setUint32(0, h0, true); dv.setUint32(4, h1, true)
  dv.setUint32(8, h2, true); dv.setUint32(12, h3, true)
  return out
}

const PDF_PADDING =
  '\x28\xBF\x4E\x5E\x4E\x75\x8A\x41\x64\x00\x4E\x56\xFF\xFA\x01\x08' +
  '\x2E\x2E\x00\xB6\xD0\x68\x3E\x80\x2F\x0C\xA9\xFE\x64\x53\x69\x7A'

const PAD32 = strToBytes(PDF_PADDING)

function padPw(pw: string): Uint8Array {
  const b = strToBytes(pw)
  const out = new Uint8Array(32)
  out.set(b.slice(0, 32))
  for (let i = Math.min(b.length, 32); i < 32; i++) out[i] = PAD32[i]
  return out
}

function encryptionKey(pw: string, id: Uint8Array, perms: number): Uint8Array {
  const padded = padPw(pw)
  const pb = new Uint8Array(4)
  new DataView(pb.buffer).setUint32(0, perms, true)
  const inp = new Uint8Array(padded.length + pb.length + id.length)
  inp.set(padded); inp.set(pb, padded.length); inp.set(id, padded.length + pb.length)
  return md5(inp).slice(0, 5)
}

function computeO(pw: string, key: Uint8Array): Uint8Array {
  return rc4(key, padPw(pw))
}

function computeU(key: Uint8Array, _id: Uint8Array): Uint8Array {
  // RC4(key, paddingString)  per PDF 1.7 spec §7.6.3.3
  const padding = new Uint8Array(32)
  for (let i = 0; i < 32; i++) padding[i] = PAD32[i]
  return rc4(key, padding)
}

function objKey(key: Uint8Array, objNum: number, genNum: number): Uint8Array {
  const d = new Uint8Array(key.length + 5)
  d.set(key)
  d[key.length] = objNum & 0xff
  d[key.length + 1] = (objNum >> 8) & 0xff
  d[key.length + 2] = (objNum >> 16) & 0xff
  d[key.length + 3] = genNum & 0xff
  d[key.length + 4] = (genNum >> 8) & 0xff
  return md5(d).slice(0, 10)
}

function randomFileId(): Uint8Array {
  const a = new Uint8Array(16)
  crypto.getRandomValues(a)
  return a
}

// ---------------------------------------------------------------------------
// Byte-level PDF encryption
// ---------------------------------------------------------------------------

async function addPdfPassword(pdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const text = new TextDecoder().decode(pdfBytes)
  const fileId = randomFileId()
  const perms = -44
  const key = encryptionKey(password, fileId, perms)
  const oVal = computeO(password, key)
  const uVal = computeU(key, fileId)

  // Locate trailer and its dictionary
  const startxrefIdx = text.lastIndexOf('startxref')
  if (startxrefIdx < 0) throw new Error('Invalid PDF: no startxref')
  const xrefEnd = text.lastIndexOf('trailer', startxrefIdx)
  if (xrefEnd < 0) throw new Error('Invalid PDF: no trailer')
  const trailerStart = text.indexOf('<<', xrefEnd)
  const trailerEnd = text.lastIndexOf('>>', startxrefIdx) + 2
  if (trailerStart < 0 || trailerEnd <= trailerStart) throw new Error('Invalid PDF: trailer dict')

  const existingTrailer = text.slice(trailerStart, trailerEnd)
  const cleanTrailer = existingTrailer
    .replace(/\/ID\s*\[.*?\]/gi, '')
    .replace(/\/Encrypt\s*\d+\s+\d+\s+R/gi, '')
    .trim()

  // Determine next free object number
  const objRe = /(\d+)\s+\d+\s+obj/gi
  let maxObj = 0
  let m: RegExpExecArray | null
  while ((m = objRe.exec(text)) !== null) maxObj = Math.max(maxObj, parseInt(m[1], 10))
  const encObjNum = maxObj + 1

  const idHex = `<${bytesToHex(fileId)}>`
  const encRef = `${encObjNum} 0 R`

  const newTrailerDict = `<<\n${cleanTrailer.replace(/^<</, '').replace(/>>$/, '').trim()}\n/ID [${idHex} ${idHex}]\n/Encrypt ${encRef}\n>>`

  // Encrypt content of each object
  let encText = text
  const objMatches: Array<{ start: number; end: number; num: number; gen: number }> = []
  const objRe2 = /(\d+)\s+(\d+)\s+obj/gi
  let m2: RegExpExecArray | null
  while ((m2 = objRe2.exec(text)) !== null) {
    const num = parseInt(m2[1], 10), gen = parseInt(m2[2], 10)
    const start = m2.index
    const endMatch = text.indexOf('endobj', m2.index)
    if (endMatch >= 0) objMatches.push({ start, end: endMatch + 6, num, gen })
  }

  for (const obj of objMatches) {
    const eKey = objKey(key, obj.num, obj.gen)
    const slice = encText.slice(obj.start, obj.end)

    // Encrypt hex strings
    let encrypted = slice.replace(/<([0-9a-fA-F]+)>/g, (_m, hex) => {
      const raw = hexToBytes(hex)
      return `<${bytesToHex(rc4(eKey, raw))}>`
    })

    // Encrypt stream data
    const streamRe = /stream\n([\s\S]*?)\nendstream/g
    encrypted = encrypted.replace(streamRe, (_m, data) => {
      const raw = strToBytes(data)
      const encd = rc4(eKey, raw)
      return `stream\n${new TextDecoder().decode(encd)}\nendstream`
    })

    encText = encText.slice(0, obj.start) + encrypted + encText.slice(obj.end)
  }

  // Append encryption dict object, new xref, trailer
  const encryptObj = `${encObjNum} 0 obj\n<< /Filter /Standard /V 1 /R 2 /O <${bytesToHex(oVal)}> /U <${bytesToHex(uVal)}> /P ${perms} >>\nendobj\n`

  const encStart = encText.length + encryptObj.length // approximate end of prior content
  const xrefEntries = objMatches.length + 2 // + null entry + new encryption object

  let xref = `xref\n0 ${xrefEntries}\n`
  xref += `0000000000 65535 f \n`
  for (const o of objMatches) {
    xref += `${o.start.toString().padStart(10, '0')} ${o.gen.toString().padStart(5, '0')} n \n`
  }
  const trailer = `trailer\n${newTrailerDict}\n`
  xref += `${encStart.toString().padStart(10, '0')} 00000 n \n`

  const finalPdf = encText + encryptObj + xref + trailer + `startxref\n${encStart}\n%%EOF`
  return strToBytes(finalPdf)
}

// ---------------------------------------------------------------------------
// Byte-level PDF decryption
// ---------------------------------------------------------------------------

async function removePdfPassword(pdfBytes: Uint8Array, password: string): Promise<Uint8Array> {
  const text = new TextDecoder().decode(pdfBytes)

  // Locate trailer and extract /Encrypt + /ID
  const startxrefIdx = text.lastIndexOf('startxref')
  if (startxrefIdx < 0) throw new Error('Invalid PDF: no startxref')
  const xrefEnd = text.lastIndexOf('trailer', startxrefIdx)
  if (xrefEnd < 0) throw new Error('Invalid PDF: no trailer')
  const trailerStart = text.indexOf('<<', xrefEnd)
  const trailerEnd = text.lastIndexOf('>>', startxrefIdx) + 2
  if (trailerStart < 0 || trailerEnd <= trailerStart) throw new Error('Invalid PDF: trailer dict')

  const trailerContent = text.slice(trailerStart, trailerEnd)

  // Extract encrypt reference
  const encMatch = trailerContent.match(/\/Encrypt\s+(\d+)\s+(\d+)\s+R/i)
  if (!encMatch) throw new Error('This PDF is not encrypted.')

  const encryptObjNum = parseInt(encMatch[1], 10)

  // Extract file ID
  const idMatch = trailerContent.match(/\/ID\s*\[<([0-9a-fA-F]*)>/i)
  if (!idMatch) throw new Error('PDF file ID not found in trailer.')

  const fileId = hexToBytes(idMatch[1])

  // Find the encryption dictionary object
  const encObjRe = new RegExp(`${encryptObjNum}\\s+\\d+\\s+obj\\s*([\\s\\S]*?)\\nendobj`, 'i')
  const encObjMatch = encObjRe.exec(text)
  if (!encObjMatch) throw new Error('Encryption dictionary object not found.')

  const encDictText = encObjMatch[1]

  // Extract permissions from encryption dict
  const pMatch = encDictText.match(/\/P\s+(-?\d+)/)
  const perms = pMatch ? parseInt(pMatch[1], 10) : -44

  // Extract O value
  const oMatch = encDictText.match(/\/O\s*<([0-9a-fA-F]+)>/i)
  if (!oMatch) throw new Error('Encryption dictionary missing /O value.')

  // Derive encryption key from password + file ID
  const key = encryptionKey(password, fileId, perms)

  // Verify password by computing U value and comparing
  const computedU = computeU(key, fileId)
  const uMatch = encDictText.match(/\/U\s*<([0-9a-fA-F]+)>/i)
  if (uMatch) {
    const existingUHex = uMatch[1].toLowerCase()
    const computedUHex = bytesToHex(computedU).toLowerCase()
    // Compare first bytes (some PDFs may vary the rest)
    if (existingUHex.slice(0, 32) !== computedUHex.slice(0, 32)) {
      throw new Error('Incorrect password.')
    }
  }

  // Find all objects
  const objMatches: Array<{ start: number; end: number; num: number; gen: number }> = []
  const objRe = /(\d+)\s+(\d+)\s+obj/gi
  let m: RegExpExecArray | null
  while ((m = objRe.exec(text)) !== null) {
    const num = parseInt(m[1], 10), gen = parseInt(m[2], 10)
    const start = m.index
    const endMatch = text.indexOf('endobj', m.index)
    if (endMatch >= 0) objMatches.push({ start, end: endMatch + 6, num, gen })
  }

  // Decrypt each object
  let decText = text
  // Process objects skipping the encryption dictionary object itself
  for (const obj of objMatches) {
    if (obj.num === encryptObjNum) continue // skip encryption dict
    const objEKey = objKey(key, obj.num, obj.gen)
    const slice = decText.slice(obj.start, obj.end)

    // Decrypt hex strings
    let decrypted = slice.replace(/<([0-9a-fA-F]+)>/g, (_m, hex) => {
      const raw = hexToBytes(hex)
      return `<${bytesToHex(rc4(objEKey, raw))}>`
    })

    // Decrypt stream data
    const streamRe = /stream\n([\s\S]*?)\nendstream/g
    decrypted = decrypted.replace(streamRe, (_m, data) => {
      const raw = strToBytes(data)
      const decd = rc4(objEKey, raw)
      return `stream\n${new TextDecoder().decode(decd)}\nendstream`
    })

    decText = decText.slice(0, obj.start) + decrypted + decText.slice(obj.end)
  }

  // Remove encryption dictionary and update trailer
  // Remove the encryption object
  const encObjFullRe = new RegExp(
    `${encryptObjNum}\\s+\\d+\\s+obj[\\s\\S]*?\\nendobj\\n`, 'i'
  )
  decText = decText.replace(encObjFullRe, '')

  // Remove /Encrypt from trailer and remove /ID (we'll keep it)
  const trailerStart2 = decText.lastIndexOf('trailer', decText.lastIndexOf('startxref'))
  const trailerStart2Dict = decText.indexOf('<<', trailerStart2)
  const trailerEnd2 = decText.lastIndexOf('>>', decText.lastIndexOf('startxref')) + 2
  const currTrailer = decText.slice(trailerStart2Dict, trailerEnd2)
  const newTrailer2 = currTrailer
    .replace(/\/Encrypt\s*\d+\s+\d+\s+R/gi, '')
    .trim()

  decText =
    decText.slice(0, trailerStart2Dict) +
    newTrailer2 +
    decText.slice(trailerEnd2)

  // Rebuild xref with correct offsets
  // Find objects in the decrypted text
  const objMatchesFinal: Array<{ start: number; end: number; num: number; gen: number }> = []
  const objRe3 = /(\d+)\s+(\d+)\s+obj/gi
  let m3: RegExpExecArray | null
  while ((m3 = objRe3.exec(decText)) !== null) {
    const num = parseInt(m3[1], 10), gen = parseInt(m3[2], 10)
    const start = m3.index
    const endMatch = decText.indexOf('endobj', m3.index)
    if (endMatch >= 0) objMatchesFinal.push({ start, end: endMatch + 6, num, gen })
  }

  const startxrefIdx2 = decText.lastIndexOf('startxref')
  const xrefEnd2 = decText.lastIndexOf('trailer', startxrefIdx2)
  const finalXrefStart = decText.indexOf('xref', xrefEnd2 - 100) || xrefEnd2

  const xrefEntries2 = objMatchesFinal.length + 1
  let finalXref = `xref\n0 ${xrefEntries2}\n`
  finalXref += `0000000000 65535 f \n`
  for (const o of objMatchesFinal) {
    finalXref += `${o.start.toString().padStart(10, '0')} ${o.gen.toString().padStart(5, '0')} n \n`
  }

  const finalTrailerDict = decText.slice(decText.indexOf('<<', xrefEnd2), decText.indexOf('>>', startxrefIdx2) + 2)
    .replace(/\/ID\s*\[.*?\]/gi, '')
    .replace(/\/Encrypt\s*\d+\s+\d+\s+R/gi, '')
    .trim()

  // Find info ref to keep
  const idIdx = decText.lastIndexOf('startxref')
  const preStartxref = decText.slice(0, idIdx).lastIndexOf('\n')
  const finalPdf =
    decText.slice(0, finalXrefStart) +
    `\n${finalXref}` +
    `trailer\n${finalTrailerDict}\n` +
    `startxref\n${finalXrefStart}\n%%EOF`

  // Fix up - ensure valid offset
  const finalBytes = strToBytes(finalPdf)
  return finalBytes
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PdfPasswordPage() {
  const t = useTranslations('tools.pdf-password')
  const ct = useTranslations('common')

  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<Mode>('lock')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || f.type !== 'application/pdf') {
      setError(ct("selectValidPdf"))
      return
    }
    setError('')
    setSuccess('')
    setFile(f)
  }, [])

  const handleProcess = useCallback(async () => {
    if (!file) return
    setError('')
    setSuccess('')

    if (mode === 'lock') {
      if (!password) { setError('Please enter a password.'); return }
      if (password.length < 4) { setError('Password must be at least 4 characters long.'); return }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    }
    if (mode === 'unlock' && !password) { setError('Please enter the current PDF password.'); return }

    setLoading(true)

    try {
      const buffer = await file.arrayBuffer()
      const pdfBytes = new Uint8Array(buffer)

      if (mode === 'lock') {
        // ---------- LOCK: build with pdf-lib, then add encryption ----------
        const pdfLib = await import('pdf-lib')
        const srcDoc = await pdfLib.PDFDocument.load(pdfBytes, { ignoreEncryption: true })
        const newDoc = await pdfLib.PDFDocument.create()
        const pages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices())
        for (const page of pages) newDoc.addPage(page)

        const rawBytes = new Uint8Array(await newDoc.save())
        const encryptedBytes = await addPdfPassword(rawBytes, password)
        const blob = new Blob([encryptedBytes as unknown as BlobPart], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = (file.name || 'document').replace(/\.pdf$/i, '') + '-protected.pdf'
        link.click()
        URL.revokeObjectURL(url)
        setSuccess('PDF password protected successfully!')
      } else {
        // ---------- UNLOCK: byte-level decryption ----------
        const decryptedBytes = await removePdfPassword(pdfBytes, password)
        const blob = new Blob([decryptedBytes as unknown as BlobPart], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = (file.name || 'document').replace(/\.pdf$/i, '') + '-unlocked.pdf'
        link.click()
        URL.revokeObjectURL(url)
        setSuccess('Password removed successfully!')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      if (msg.includes('password') || msg.includes('incorrect') || msg.includes('encrypted')) {
        setError(msg)
      } else {
        setError(`Error processing PDF: ${msg}`)
      }
    }
    setLoading(false)
  }, [file, mode, password, confirmPassword])

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{t('h1')}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{t('description')}</p>
      <AdBanner className="mb-8 h-20" />

      <div className="bg-white dark:bg-gray-800 border rounded-xl p-6 mb-8">
        <div className="flex gap-2 mb-4">
          <button onClick={() => { setMode('lock'); setError(''); setSuccess(''); }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'lock' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            Protect PDF (Add Password)
          </button>
          <button onClick={() => { setMode('unlock'); setError(''); setSuccess(''); }}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === 'unlock' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            Unlock PDF (Remove Password)
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload PDF</label>
          <input type="file" accept="application/pdf" onChange={handleUpload}
            className="w-full p-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 file:mr-3 file:py-2 file:px-4 file:border-0 file:rounded-lg file:text-sm file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100" />
        </div>

        {file && <p className="text-xs text-gray-500 mb-4">Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</p>}

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">{mode === 'lock' ? 'Set Password' : 'Enter Current Password'}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'lock' ? 'Enter a password to protect the PDF' : 'Enter the current PDF password'}
              className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {mode === 'lock' && (
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter the password"
                className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          )}
        </div>

        {error && <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-700 dark:text-red-400">{error}</div>}
        {success && <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg text-sm text-green-700 dark:text-green-400">{success}</div>}

        <button onClick={handleProcess}
          disabled={!file || loading || !password || (mode === 'lock' && password !== confirmPassword)}
          className="w-full px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading ? 'Processing...' : mode === 'lock' ? 'Protect PDF' : 'Unlock PDF'}
        </button>

        {!file && (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 border-2 border-dashed rounded-lg mt-4">
            <svg className="mx-auto h-12 w-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-sm">Upload a PDF to {mode === 'lock' ? 'protect' : 'unlock'}</p>
          </div>
        )}
      </div>

      <section className="prose dark:prose-invert max-w-none">
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
        <div className="space-y-4 not-prose">
          {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold">{item.q}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div></section>
    </div>
  )
}
