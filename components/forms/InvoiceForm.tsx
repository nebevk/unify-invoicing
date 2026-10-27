'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Customer } from '@/lib/types'

interface InvoiceFormProps {
  customers: Customer[]
  userId: string
}

export default function InvoiceForm({ customers, userId }: InvoiceFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_date: new Date().toISOString().split('T')[0],
    service_description: '',
    quantity: 1,
    unit_price: 0,
    due_date: '',
    notes: '',
  })

  const selectedCustomer = customers.find((c) => c.id === formData.customer_id)
  const totalAmount = formData.quantity * formData.unit_price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.customer_id) {
      setError('Izberite stranko')
      setLoading(false)
      return
    }

    if (!selectedCustomer) {
      setError('Stranka ni najdena')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      // Get next invoice number
      const year = new Date(formData.invoice_date).getFullYear()
      const { data: invoiceNumber, error: numberError } = await supabase
        .rpc('get_next_invoice_number', { year })

      if (numberError) throw numberError

      // Parse invoice number to get sequence
      const [, seqStr] = invoiceNumber.split('-')
      const sequence = parseInt(seqStr, 10)

      // Create invoice
      const { data: invoice, error: insertError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          invoice_year: year,
          invoice_sequence: sequence,
          invoice_date: formData.invoice_date,
          customer_id: formData.customer_id,
          customer_name: selectedCustomer.name,
          customer_address: selectedCustomer.address,
          customer_tax_id: selectedCustomer.tax_id,
          customer_registration_id: selectedCustomer.registration_id,
          service_description: formData.service_description,
          quantity: formData.quantity,
          unit_price: formData.unit_price,
          total_amount: totalAmount,
          payment_status: 'issued',
          due_date: formData.due_date || null,
          notes: formData.notes || null,
          user_id: userId,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/dashboard/invoices/${invoice.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Napaka pri ustvarjanju računa')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-1">
            Stranka *
          </label>
          <select
            id="customer_id"
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Izberite stranko</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
          {customers.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              Ni strank.{' '}
              <a href="/dashboard/customers/new" className="text-blue-600 hover:underline">
                Dodaj stranko
              </a>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="invoice_date" className="block text-sm font-medium text-gray-700 mb-1">
            Datum računa *
          </label>
          <input
            id="invoice_date"
            type="date"
            value={formData.invoice_date}
            onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service_description" className="block text-sm font-medium text-gray-700 mb-1">
          Opis storitve *
        </label>
        <textarea
          id="service_description"
          value={formData.service_description}
          onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Vzdrževanje IT sistemov - oktober 2026"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Količina
          </label>
          <input
            id="quantity"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 1 })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="unit_price" className="block text-sm font-medium text-gray-700 mb-1">
            Cena na enoto (€) *
          </label>
          <input
            id="unit_price"
            type="number"
            step="0.01"
            min="0"
            value={formData.unit_price}
            onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skupaj (€)</label>
          <div className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 font-semibold text-gray-900">
            {totalAmount.toFixed(2)} €
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
          Rok plačila (opcijsko)
        </label>
        <input
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Opombe (opcijsko)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Dodatne opombe ali navodila..."
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
        >
          Prekliči
        </button>
        <button
          type="submit"
          disabled={loading || customers.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Ustvarjanje...' : 'Ustvari račun'}
        </button>
      </div>
    </form>
  )
}
