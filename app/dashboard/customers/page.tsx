import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user!.id)
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stranke</h1>
          <p className="text-gray-600 mt-1">Upravljanje strank in ponavljajočih računov</p>
        </div>
        <Link
          href="/dashboard/customers/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          + Nova stranka
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Napaka pri nalaganju strank: {error.message}
        </div>
      )}

      {!customers || customers.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ni strank</h3>
          <p className="text-gray-600 mb-6">Dodajte svojo prvo stranko.</p>
          <Link
            href="/dashboard/customers/new"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Dodaj stranko
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Link
              key={customer.id}
              href={`/dashboard/customers/${customer.id}`}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                {customer.recurring_enabled && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Ponavljajoči
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">{customer.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{customer.address}</p>

              {customer.tax_id && (
                <div className="text-xs text-gray-600 mb-2">
                  <span className="font-medium">Davčna:</span> {customer.tax_id}
                </div>
              )}

              {customer.recurring_enabled && customer.recurring_amount && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Ponavljajoči račun:{' '}
                    <span className="font-semibold text-gray-900">
                      {Number(customer.recurring_amount).toFixed(2)} €
                    </span>{' '}
                    {customer.recurring_frequency === 'monthly' && 'mesečno'}
                    {customer.recurring_frequency === 'quarterly' && 'četrtletno'}
                    {customer.recurring_frequency === 'yearly' && 'letno'}
                  </p>
                </div>
              )}

              {!customer.active && (
                <div className="mt-4">
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    Neaktiven
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
