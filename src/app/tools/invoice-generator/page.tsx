'use client'

import { useState } from 'react'
import AdBanner from '@/components/AdBanner'

interface LineItem {
  desc: string; qty: number; rate: number
}

function emptyItem(): LineItem { return { desc: '', qty: 1, rate: 0 } }

function formatCurrency(n: number) { return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }

export default function InvoiceGeneratorPage() {
  const [businessName, setBusinessName] = useState('')
  const [businessEmail, setBusinessEmail] = useState('')
  const [businessAddress, setBusinessAddress] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [invNum, setInvNum] = useState(`INV-${Date.now().toString(36).toUpperCase()}`)
  const [invDate, setInvDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0]
  })
  const [items, setItems] = useState<LineItem[]>([emptyItem()])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const updateItem = (i: number, field: keyof LineItem, value: string | number) => {
    const copy = [...items]; copy[i] = { ...copy[i], [field]: value as any }; setItems(copy)
  }
  const addItem = () => setItems([...items, emptyItem()])
  const removeItem = (i: number) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i))

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.rate, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const handlePrint = () => {
    const pw = window.open('', '_blank')
    if (!pw) return
    pw.document.write(`<html><head><title>Invoice ${invNum}</title><style>
      body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 40px; color: #333; }
      h1 { font-size: 28px; color: #1a1a1a; } .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
      .info { font-size: 13px; color: #555; line-height: 1.6; }
      .info strong { color: #333; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th { background: #2563eb; color: white; text-align: right; padding: 10px 12px; font-size: 13px; }
      th:first-child { text-align: left; }
      td { padding: 10px 12px; text-align: right; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
      td:first-child { text-align: left; }
      .total { text-align: right; font-size: 14px; margin-top: 20px; }
      .total-line { margin: 4px 0; } .grand-total { font-size: 20px; font-weight: 700; color: #2563eb; }
      .notes { margin-top: 30px; font-size: 12px; color: #666; }
      @media print { body { margin: 0; padding: 20px 40px; } }
    </style></head><body>`)
    pw.document.write(`<div class="header"><div><h1>INVOICE</h1><div class="info"><strong>${businessName || 'Your Business'}</strong><br>${businessAddress || ''}<br>${businessEmail || ''}</div></div>
      <div class="info" style="text-align:right"><strong>${invNum}</strong><br>Date: ${invDate}<br>Due: ${dueDate}</div></div>`)
    pw.document.write(`<div class="info" style="margin-bottom:20px"><strong>Bill To:</strong><br>${clientName || 'Client Name'}<br>${clientAddress || ''}<br>${clientEmail || ''}</div>`)
    pw.document.write(`<table><thead><tr><th style="width:50%">Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead><tbody>`)
    items.filter(i => i.desc).forEach(i => pw.document.write(`<tr><td>${i.desc}</td><td>${i.qty}</td><td>$${formatCurrency(i.rate)}</td><td>$${formatCurrency(i.qty * i.rate)}</td></tr>`))
    pw.document.write('</tbody></table>')
    pw.document.write(`<div class="total"><p class="total-line">Subtotal: $${formatCurrency(subtotal)}</p>`)
    if (taxRate > 0) pw.document.write(`<p class="total-line">Tax (${taxRate}%): $${formatCurrency(tax)}</p>`)
    pw.document.write(`<p class="grand-total">Total: $${formatCurrency(total)}</p></div>`)
    if (notes) pw.document.write(`<div class="notes"><strong>Notes:</strong><br>${notes}</div>`)
    pw.document.write('</body></html>')
    pw.document.close()
    pw.focus()
    pw.print()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Invoice Generator</h1>
        <p className="text-gray-500">Create professional invoices and download as PDF. Free for freelancers and small businesses.</p>
      </div>
      <AdBanner className="mb-8 h-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">From (Your Business)</h2>
            <div className="space-y-2">
              <FullInput label="Business Name" value={businessName} onChange={setBusinessName} />
              <FullInput label="Email" value={businessEmail} onChange={setBusinessEmail} />
              <FullInput label="Address" value={businessAddress} onChange={setBusinessAddress} />
            </div>
          </div>

          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">Bill To</h2>
            <div className="space-y-2">
              <FullInput label="Client Name" value={clientName} onChange={setClientName} />
              <FullInput label="Email" value={clientEmail} onChange={setClientEmail} />
              <FullInput label="Address" value={clientAddress} onChange={setClientAddress} />
            </div>
          </div>

          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">Invoice Details</h2>
            <div className="grid grid-cols-3 gap-3">
              <FullInput label="Invoice #" value={invNum} onChange={setInvNum} />
              <FullInput label="Date" value={invDate} onChange={setInvDate} type="date" />
              <FullInput label="Due Date" value={dueDate} onChange={setDueDate} type="date" />
            </div>
          </div>

          <div className="p-4 border rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-sm">Items</h2>
              <button onClick={addItem} className="text-xs text-blue-600 hover:underline">+ Add Row</button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-0.5">Description</label>
                  <input type="text" value={item.desc} onChange={e => updateItem(i, 'desc', e.target.value)}
                    className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="w-16">
                  <label className="block text-xs text-gray-400 mb-0.5">Qty</label>
                  <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', Number(e.target.value))} min={1}
                    className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-400 mb-0.5">Rate ($)</label>
                  <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', Number(e.target.value))} min={0}
                    className="w-full p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="w-20 text-right pb-2 text-sm">{formatCurrency(item.qty * item.rate)}</div>
                {items.length > 1 && <button onClick={() => removeItem(i)} className="pb-2 text-red-400 hover:text-red-600 text-lg">×</button>}
              </div>
            ))}
            <div className="border-t pt-2 mt-2 space-y-1 text-sm text-right">
              <p>Subtotal: <span className="font-medium">${formatCurrency(subtotal)}</span></p>
              <div className="flex items-center justify-end gap-2"><span>Tax:</span>
                <input type="number" value={taxRate} onChange={e => setTaxRate(Number(e.target.value))} min={0} max={100} className="w-16 p-1 border rounded text-sm text-right dark:bg-gray-700 dark:border-gray-600" />%
                <span className="w-20 text-right font-medium">${formatCurrency(tax)}</span>
              </div>
              <p className="text-lg font-bold text-blue-600">Total: ${formatCurrency(total)}</p>
            </div>
          </div>

          <div className="p-4 border rounded-xl">
            <h2 className="font-semibold text-sm mb-3">Notes</h2>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              placeholder="Payment terms, thank you message, etc."
              className="w-full p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button onClick={() => setShowPreview(!showPreview)}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {showPreview ? 'Hide Preview' : 'Preview Invoice'}
          </button>
          {showPreview && (
            <button onClick={handlePrint}
              className="w-full py-2.5 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              Download PDF
            </button>
          )}
        </div>

        <div>
          {showPreview ? (
            <div className="border rounded-xl bg-white dark:bg-gray-800 p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2 text-gray-900">INVOICE</h1>
                  <p className="text-sm text-gray-600"><strong>{businessName || 'Your Business'}</strong><br />{businessAddress}<br />{businessEmail}</p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p className="font-bold text-gray-900">{invNum}</p>
                  <p>Date: {invDate}</p>
                  <p>Due: {dueDate}</p>
                </div>
              </div>
              <div className="mb-6 text-sm text-gray-600">
                <p className="font-semibold text-gray-900 mb-1">Bill To:</p>
                <p>{clientName || 'Client Name'}<br />{clientAddress}<br />{clientEmail}</p>
              </div>
              <table className="w-full text-sm mb-4">
                <thead><tr className="bg-blue-600 text-white"><th className="p-2 text-left">Description</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Rate</th><th className="p-2 text-right">Amount</th></tr></thead>
                <tbody>
                  {items.filter(i => i.desc).map((i, idx) => (
                    <tr key={idx} className="border-b dark:border-gray-600">
                      <td className="p-2 text-gray-800 dark:text-gray-200">{i.desc}</td>
                      <td className="p-2 text-right text-gray-800 dark:text-gray-200">{i.qty}</td>
                      <td className="p-2 text-right text-gray-800 dark:text-gray-200">${formatCurrency(i.rate)}</td>
                      <td className="p-2 text-right font-medium text-gray-800 dark:text-gray-200">${formatCurrency(i.qty * i.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-right text-sm space-y-1 text-gray-800 dark:text-gray-200">
                <p>Subtotal: <span className="font-medium">${formatCurrency(subtotal)}</span></p>
                {taxRate > 0 && <p>Tax ({taxRate}%): <span className="font-medium">${formatCurrency(tax)}</span></p>}
                <p className="text-xl font-bold text-blue-600">Total: ${formatCurrency(total)}</p>
              </div>
              {notes && <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded text-xs text-gray-500"><p className="font-medium mb-1">Notes:</p><p>{notes}</p></div>}
            </div>
          ) : (
            <div className="sticky top-24 min-h-[500px] border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-sm bg-gray-50 dark:bg-gray-800/50">
              Fill in the details and click Preview Invoice
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-bold mb-4">Free Invoice Generator</h2>
        <p className="text-sm text-gray-500">Create professional invoices for your business. Add items, tax, and notes. Download as PDF. No sign-up required.</p>
      </div>
    </div>
  )
}

function FullInput({ label, value, onChange, placeholder, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-0.5">{label}</label>
      <input type={type || 'text'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full p-2.5 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  )
}
