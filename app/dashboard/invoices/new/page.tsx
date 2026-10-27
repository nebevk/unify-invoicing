import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InvoiceForm from '@/components/forms/InvoiceForm'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch customers for the dropdown
  const { data: customers } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .eq('active', true)
    .order('name')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nov račun</h1>
        <p className="text-gray-600 mt-1">Ustvarite nov račun za stranko</p>
      </div>

      {(!customers || customers.length === 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            <strong>Opozorilo:</strong> Nimate še strank. Najprej{' '}
            <a href="/dashboard/customers/new" className="underline font-medium">
              dodajte stranko
            </a>
            .
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <InvoiceForm customers={customers || []} userId={user.id} />
      </div>
    </div>
  )
}
