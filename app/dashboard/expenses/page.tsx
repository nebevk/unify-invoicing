import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const categoryLabels: Record<string, string> = {
  office_supplies: 'Pisarniški material',
  software: 'Programska oprema',
  hosting: 'Gostovanje',
  accounting: 'Računovodstvo',
  bank_fees: 'Bančne storitve',
  insurance: 'Zavarovanje',
  travel: 'Potni stroški',
  equipment: 'Oprema',
  other: 'Ostalo',
}

export default async function ExpensesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user!.id)
    .order('expense_date', { ascending: false })

  const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stroški</h1>
          <p className="text-gray-600 mt-1">Sledenje poslovnim stroškom</p>
        </div>
        <Link
          href="/dashboard/expenses/new"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
        >
          + Nov strošek
        </Link>
      </div>

      {totalExpenses > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Skupni stroški</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalExpenses.toFixed(2)} €
              </p>
            </div>
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Napaka pri nalaganju stroškov: {error.message}
        </div>
      )}

      {!expenses || expenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">💸</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ni stroškov</h3>
          <p className="text-gray-600 mb-6">Dodajte svoj prvi poslovni strošek.</p>
          <Link
            href="/dashboard/expenses/new"
            className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
          >
            Dodaj strošek
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorija
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dobavitelj
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Znesek
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(expense.expense_date).toLocaleDateString('sl-SI')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{expense.description}</div>
                      {expense.notes && (
                        <div className="text-xs text-gray-500 mt-1">{expense.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                        {categoryLabels[expense.category] || expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {expense.vendor_name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                      {Number(expense.amount).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {expenses && expenses.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Prikazanih {expenses.length} stroškov
        </div>
      )}
    </div>
  )
}
