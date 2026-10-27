import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Invoice } from '@/lib/types'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user!.id)
    .order('invoice_date', { ascending: false })

  const getStatusBadge = (status: Invoice['payment_status']) => {
    const badges = {
      paid: 'bg-green-100 text-green-700',
      issued: 'bg-yellow-100 text-yellow-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    }
    const labels = {
      paid: 'Plačan',
      issued: 'Izdan',
      overdue: 'Prekoračen',
      cancelled: 'Preklican',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Računi</h1>
          <p className="text-gray-600 mt-1">Upravljanje računov in plačil</p>
        </div>
        <Link
          href="/dashboard/invoices/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          + Nov račun
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Napaka pri nalaganju računov: {error.message}
        </div>
      )}

      {!invoices || invoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">📄</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ni računov</h3>
          <p className="text-gray-600 mb-6">Ustvarite svoj prvi račun za stranko.</p>
          <Link
            href="/dashboard/invoices/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ustvari račun
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Številka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stranka
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Znesek
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{invoice.customer_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.invoice_date).toLocaleDateString('sl-SI')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {Number(invoice.total_amount).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(invoice.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/dashboard/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-700 mr-4"
                      >
                        Poglej
                      </Link>
                      <Link
                        href={`/dashboard/invoices/${invoice.id}/pdf`}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        PDF
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {invoices && invoices.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Prikazanih {invoices.length} računov
        </div>
      )}
    </div>
  )
}
