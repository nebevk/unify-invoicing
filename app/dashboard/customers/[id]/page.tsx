import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !customer) {
    notFound()
  }

  // Fetch invoices for this customer
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', id)
    .order('invoice_date', { ascending: false })

  const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0
  const paidRevenue =
    invoices
      ?.filter((inv) => inv.payment_status === 'paid')
      .reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link
          href="/dashboard/customers"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block"
        >
          ← Nazaj na stranke
        </Link>
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
          {!customer.active && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
              Neaktiven
            </span>
          )}
        </div>
      </div>

      {/* Customer Details Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Podatki stranke</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Naslov</p>
            <p className="text-gray-900">{customer.address}</p>
          </div>
          {customer.tax_id && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Davčna številka</p>
              <p className="text-gray-900">{customer.tax_id}</p>
            </div>
          )}
          {customer.registration_id && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Matična številka</p>
              <p className="text-gray-900">{customer.registration_id}</p>
            </div>
          )}
          {customer.email && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{customer.email}</p>
            </div>
          )}
          {customer.phone && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Telefon</p>
              <p className="text-gray-900">{customer.phone}</p>
            </div>
          )}
        </div>

        {customer.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Opombe</p>
            <p className="text-gray-700 text-sm">{customer.notes}</p>
          </div>
        )}
      </div>

      {/* Recurring Invoice Settings */}
      {customer.recurring_enabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold text-blue-900">Ponavljajoči računi</h2>
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
              Omogočeno
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-medium mb-1">Pogostost</p>
              <p className="text-blue-900">
                {customer.recurring_frequency === 'monthly' && 'Mesečno'}
                {customer.recurring_frequency === 'quarterly' && 'Četrtletno'}
                {customer.recurring_frequency === 'yearly' && 'Letno'}
              </p>
            </div>
            <div>
              <p className="text-blue-700 font-medium mb-1">Dan v mesecu</p>
              <p className="text-blue-900">{customer.recurring_day}.</p>
            </div>
            <div>
              <p className="text-blue-700 font-medium mb-1">Znesek</p>
              <p className="text-blue-900 font-semibold">
                {Number(customer.recurring_amount).toFixed(2)} €
              </p>
            </div>
            {customer.recurring_next_date && (
              <div>
                <p className="text-blue-700 font-medium mb-1">Naslednji račun</p>
                <p className="text-blue-900">
                  {new Date(customer.recurring_next_date).toLocaleDateString('sl-SI')}
                </p>
              </div>
            )}
          </div>
          {customer.recurring_service_description && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-blue-700 font-medium mb-1">Opis storitve</p>
              <p className="text-blue-900">{customer.recurring_service_description}</p>
            </div>
          )}
        </div>
      )}

      {/* Revenue Summary */}
      {invoices && invoices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Vsi računi</p>
            <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Skupni prihodki</p>
            <p className="text-2xl font-bold text-green-600">{totalRevenue.toFixed(2)} €</p>
          </div>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <p className="text-sm text-gray-500 mb-1">Plačano</p>
            <p className="text-2xl font-bold text-blue-600">{paidRevenue.toFixed(2)} €</p>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {invoices && invoices.length > 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Računi</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        invoice.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : invoice.payment_status === 'overdue'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {invoice.payment_status === 'paid'
                        ? 'Plačan'
                        : invoice.payment_status === 'overdue'
                        ? 'Prekoračen'
                        : 'Izdan'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(invoice.invoice_date).toLocaleDateString('sl-SI')}
                  </p>
                </div>
                <span className="font-semibold text-gray-900">
                  {Number(invoice.total_amount).toFixed(2)} €
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Ni računov za to stranko.</p>
          <Link
            href={`/dashboard/invoices/new?customer=${id}`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ustvari račun
          </Link>
        </div>
      )}
    </div>
  )
}
