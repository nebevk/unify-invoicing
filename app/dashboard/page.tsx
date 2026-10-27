import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch summary stats
  const { count: invoiceCount } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { count: customerCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const { data: recentInvoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user!.id)
    .order('invoice_date', { ascending: false })
    .limit(5)

  const { data: pendingInvoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user!.id)
    .eq('payment_status', 'issued')
    .order('invoice_date', { ascending: false })

  const totalPending = pendingInvoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dobrodošli nazaj!</h1>
        <p className="text-gray-600 mt-1">Pregled vašega poslovanja</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vsi računi</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{invoiceCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
          <Link
            href="/dashboard/invoices"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block"
          >
            Poglej vse →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stranke</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{customerCount || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <Link
            href="/dashboard/customers"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 inline-block"
          >
            Upravljaj →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Neplačani računi</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalPending.toFixed(2)} €
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {pendingInvoices?.length || 0} neplačanih
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Hitre akcije</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/invoices/new"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
          >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">➕</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
              Nov račun
            </span>
          </Link>

          <Link
            href="/dashboard/customers/new"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
          >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">👤</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
              Nova stranka
            </span>
          </Link>

          <Link
            href="/dashboard/expenses/new"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors group"
          >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">💸</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-yellow-700">
              Nov strošek
            </span>
          </Link>

          <Link
            href="/dashboard/reports"
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
          >
            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📊</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
              Poročila
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Invoices */}
      {recentInvoices && recentInvoices.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Nedavni računi</h2>
            <Link
              href="/dashboard/invoices"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Poglej vse →
            </Link>
          </div>
          <div className="space-y-3">
            {recentInvoices.map((invoice) => (
              <Link
                key={invoice.id}
                href={`/dashboard/invoices/${invoice.id}`}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{invoice.invoice_number}</span>
                    <span className="text-sm text-gray-500">{invoice.customer_name}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{invoice.invoice_date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-900">
                    {Number(invoice.total_amount).toFixed(2)} €
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* First-time user guide */}
      {(!invoiceCount || invoiceCount === 0) && (!customerCount || customerCount === 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Začnite z nastavitvijo</h3>
          <p className="text-blue-700 mb-4">
            Dobrodošli v Unify Invoicing! Priporočamo naslednje korake:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-blue-700">
            <li>Dodajte prvo stranko (klient z ustreznimi podatki)</li>
            <li>Ustvarite račun za stranko</li>
            <li>Generirajte PDF in ga pošljite stranki</li>
            <li>Označite račun kot plačan, ko prejmete plačilo</li>
            <li>Dodajajte stroške za sledenje stroškov</li>
          </ol>
        </div>
      )}
    </div>
  )
}
