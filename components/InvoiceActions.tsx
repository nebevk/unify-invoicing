'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateInvoicePDF } from '@/lib/pdf-generator'
import type { Invoice } from '@/lib/types'

interface InvoiceActionsProps {
  invoice: Invoice
}

export default function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDownloadPDF = () => {
    const doc = generateInvoicePDF(invoice)
    doc.save(`racun-${invoice.invoice_number}.pdf`)
  }

  const handleMarkAsPaid = async () => {
    if (!confirm('Označite račun kot plačan?')) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('invoices')
      .update({
        payment_status: 'paid',
        paid_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', invoice.id)

    if (error) {
      alert('Napaka: ' + error.message)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  const handleMarkAsIssued = async () => {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('invoices')
      .update({
        payment_status: 'issued',
        paid_date: null,
      })
      .eq('id', invoice.id)

    if (error) {
      alert('Napaka: ' + error.message)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  const handleCancelInvoice = async () => {
    if (!confirm('Preklicanje računa je dokončno. Nadaljujem?')) return

    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('invoices')
      .update({
        payment_status: 'cancelled',
      })
      .eq('id', invoice.id)

    if (error) {
      alert('Napaka: ' + error.message)
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Akcije</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          📄 Prenesi PDF
        </button>

        {invoice.payment_status === 'issued' && (
          <button
            onClick={handleMarkAsPaid}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
          >
            ✓ Označi kot plačan
          </button>
        )}

        {invoice.payment_status === 'paid' && (
          <button
            onClick={handleMarkAsIssued}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 transition-colors text-sm"
          >
            ← Označi kot izdan
          </button>
        )}

        {invoice.payment_status !== 'cancelled' && (
          <button
            onClick={handleCancelInvoice}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors text-sm"
          >
            ✕ Prekliči račun
          </button>
        )}
      </div>
    </div>
  )
}
