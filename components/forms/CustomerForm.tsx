'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CustomerFormProps {
  userId: string
}

export default function CustomerForm({ userId }: CustomerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    tax_id: '',
    registration_id: '',
    email: '',
    phone: '',
    recurring_enabled: false,
    recurring_frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    recurring_day: 1,
    recurring_service_description: '',
    recurring_amount: 0,
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Calculate next recurring date if enabled
      let recurringNextDate = null
      if (formData.recurring_enabled) {
        const today = new Date()
        const nextDate = new Date(today.getFullYear(), today.getMonth() + 1, formData.recurring_day)
        recurringNextDate = nextDate.toISOString().split('T')[0]
      }

      const { data, error: insertError } = await supabase
        .from('customers')
        .insert({
          name: formData.name,
          address: formData.address,
          tax_id: formData.tax_id || null,
          registration_id: formData.registration_id || null,
          email: formData.email || null,
          phone: formData.phone || null,
          recurring_enabled: formData.recurring_enabled,
          recurring_frequency: formData.recurring_enabled ? formData.recurring_frequency : null,
          recurring_day: formData.recurring_enabled ? formData.recurring_day : null,
          recurring_service_description: formData.recurring_enabled ? formData.recurring_service_description : null,
          recurring_amount: formData.recurring_enabled ? formData.recurring_amount : null,
          recurring_next_date: recurringNextDate,
          notes: formData.notes || null,
          active: true,
          user_id: userId,
        })
        .select()
        .single()

      if (insertError) throw insertError

      router.push(`/dashboard/customers/${data.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Napaka pri dodajanju stranke')
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

      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Osnovni podatki</h3>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ime stranke *
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Primer d.o.o."
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Naslov *
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ulica 1, 1000 Ljubljana"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700 mb-1">
              Davčna številka
            </label>
            <input
              id="tax_id"
              type="text"
              value={formData.tax_id}
              onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="12345678"
            />
          </div>

          <div>
            <label htmlFor="registration_id" className="block text-sm font-medium text-gray-700 mb-1">
              Matična številka
            </label>
            <input
              id="registration_id"
              type="text"
              value={formData.registration_id}
              onChange={(e) => setFormData({ ...formData, registration_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="1234567000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="kontakt@primer.si"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="+386 1 234 5678"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t">
        <div className="flex items-center">
          <input
            id="recurring_enabled"
            type="checkbox"
            checked={formData.recurring_enabled}
            onChange={(e) => setFormData({ ...formData, recurring_enabled: e.target.checked })}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <label htmlFor="recurring_enabled" className="ml-2 text-sm font-medium text-gray-900">
            Omogoči ponavljajoče račune
          </label>
        </div>

        {formData.recurring_enabled && (
          <div className="pl-6 space-y-4 bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="recurring_frequency" className="block text-sm font-medium text-gray-700 mb-1">
                  Pogostost
                </label>
                <select
                  id="recurring_frequency"
                  value={formData.recurring_frequency}
                  onChange={(e) => setFormData({ ...formData, recurring_frequency: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="monthly">Mesečno</option>
                  <option value="quarterly">Četrtletno</option>
                  <option value="yearly">Letno</option>
                </select>
              </div>

              <div>
                <label htmlFor="recurring_day" className="block text-sm font-medium text-gray-700 mb-1">
                  Dan v mesecu (1-28)
                </label>
                <input
                  id="recurring_day"
                  type="number"
                  min="1"
                  max="28"
                  value={formData.recurring_day}
                  onChange={(e) => setFormData({ ...formData, recurring_day: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="recurring_service_description" className="block text-sm font-medium text-gray-700 mb-1">
                Opis storitve
              </label>
              <textarea
                id="recurring_service_description"
                value={formData.recurring_service_description}
                onChange={(e) => setFormData({ ...formData, recurring_service_description: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Mesečno vzdrževanje IT sistemov"
              />
            </div>

            <div>
              <label htmlFor="recurring_amount" className="block text-sm font-medium text-gray-700 mb-1">
                Znesek (€)
              </label>
              <input
                id="recurring_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.recurring_amount}
                onChange={(e) => setFormData({ ...formData, recurring_amount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Opombe
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Dodatne opombe o stranki..."
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
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Dodajanje...' : 'Dodaj stranko'}
        </button>
      </div>
    </form>
  )
}
