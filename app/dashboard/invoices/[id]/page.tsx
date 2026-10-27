import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import InvoiceActions from '@/components/InvoiceActions'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !invoice) {
    notFound()
  }

  const statusColors = {
    paid: 'bg-green-100 text-green-700',
    issued: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-700',
  }

  const statusLabels = {
    paid: 'Plačan',
    issued: 'Izdan',
    overdue: 'Prekoračen',
    cancelled: 'Preklican',
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/invoices"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2 inline-block"
          >
            ← Nazaj na račune
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Račun {invoice.invoice_number}</h1>
        </div>
        <span
          className={`px-4 py-2 rounded-lg text-sm font-medium ${statusColors[invoice.payment_status]}`}
        >
          {statusLabels[invoice.payment_status]}
        </span>
      </div>

      <InvoiceActions invoice={invoice} />

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Izdajatelj</h3>
              <p className="font-semibold text-gray-900">
                {process.env.NEXT_PUBLIC_COMPANY_NAME || 'Unify d.o.o.'}
              </p>
              <p className="text-sm text-gray-600">
                {process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Studeno 6A, 4228 Železniki'}
              </p>
              <p className="text-sm text-gray-600">
                Davčna: {process.env.NEXT_PUBLIC_COMPANY_TAX_ID || '20260393'}
              </p>
              <p className="text-sm text-gray-600">
                Matična: {process.env.NEXT_PUBLIC_COMPANY_REGISTRATION || '7179855000'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Prejemnik</h3>
              <p className="font-semibold text-gray-900">{invoice.customer_name}</p>
              <p className="text-sm text-gray-600">{invoice.customer_address}</p>
              {invoice.customer_tax_id && (
                <p className="text-sm text-gray-600">Davčna: {invoice.customer_tax_id}</p>
              )}
              {invoice.customer_registration_id && (
                <p className="text-sm text-gray-600">Matična: {invoice.customer_registration_id}</p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Datum računa</p>
              <p className="font-medium text-gray-900">
                {new Date(invoice.invoice_date).toLocaleDateString('sl-SI')}
              </p>
            </div>
            {invoice.due_date && (
              <div>
                <p className="text-sm text-gray-500">Rok plačila</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.due_date).toLocaleDateString('sl-SI')}
                </p>
              </div>
            )}
            {invoice.paid_date && (
              <div>
                <p className="text-sm text-gray-500">Datum plačila</p>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.paid_date).toLocaleDateString('sl-SI')}
                </p>
              </div>
            )}
          </div>

          {/* Service Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Storitev</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">{invoice.service_description}</p>
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Količina</p>
                  <p className="font-medium text-gray-900">{invoice.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-500">Cena/enoto</p>
                  <p className="font-medium text-gray-900">
                    {Number(invoice.unit_price).toFixed(2)} €
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Skupaj</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {Number(invoice.total_amount).toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-gray-900">Skupaj za plačilo:</span>
              <span className="text-3xl font-bold text-blue-600">
                {Number(invoice.total_amount).toFixed(2)} €
              </span>
            </div>
            <p className="text-xs text-gray-500 italic mt-2">
              Zavezanec ni identificiran za namene DDV.
            </p>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Opombe</h3>
              <p className="text-gray-700 text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Payment Details */}
          <div className="pt-4 border-t border-gray-200 bg-blue-50 -m-6 mt-4 p-6 rounded-b-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Podatki za plačilo</h3>
            <div className="space-y-1 text-sm">
              <p className="text-blue-800">
                <span className="font-medium">TRR:</span>{' '}
                {process.env.NEXT_PUBLIC_COMPANY_BANK || 'SI56 6100 0001 5473 011'}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Banka:</span>{' '}
                {process.env.NEXT_PUBLIC_COMPANY_BANK_NAME || 'Delavska hranilnica'}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Namen:</span> Račun {invoice.invoice_number}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
