'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { ExpenseCategory } from '@/lib/types'

interface ExpenseFormProps {
  userId: string
}

const categories: { value: ExpenseCategory; label: string }[] = [
  { value: 'office_supplies', label: 'Pisarniški material' },
  { value: 'software', label: 'Programska oprema' },
  { value: 'hosting', label: 'Gostovanje' },
  { value: 'accounting', label: 'Računovodstvo' },
  { value: 'bank_fees', label: 'Bančne storitve' },
  { value: 'insurance', label: 'Zavarovanje' },
  { value: 'travel', label: 'Potni stroški' },
  { value: 'equipment', label: 'Oprema' },
  { value: 'other', label: 'Ostalo' },
]

export default function ExpenseForm({ userId }: ExpenseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    expense_date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: 'other' as ExpenseCategory,
    description: '',
    vendor_name: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      const { error: insertError } = await supabase.from('expenses').insert({
        expense_date: formData.expense_date,
        amount: formData.amount,
        category: formData.category,
        description: formData.description,
        vendor_name: formData.vendor_name || null,
        notes: formData.notes || null,
        user_id: userId,
      })

      if (insertError) throw insertError

      router.push('/dashboard/expenses')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Napaka pri dodajanju stroška')
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
          <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700 mb-1">
            Datum stroška *
          </label>
          <input
            id="expense_date"
            type="date"
            value={formData.expense_date}
            onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Znesek (€) *
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Kategorija *
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Opis *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Opis stroška..."
        />
      </div>

      <div>
        <label htmlFor="vendor_name" className="block text-sm font-medium text-gray-700 mb-1">
          Dobavitelj (opcijsko)
        </label>
        <input
          id="vendor_name"
          type="text"
          value={formData.vendor_name}
          onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Ime dobavitelja"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          placeholder="Dodatne opombe..."
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
          className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Dodajanje...' : 'Dodaj strošek'}
        </button>
      </div>
    </form>
  )
}
