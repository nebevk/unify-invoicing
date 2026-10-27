import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CustomerForm from '@/components/forms/CustomerForm'

export default async function NewCustomerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nova stranka</h1>
        <p className="text-gray-600 mt-1">Dodajte novo stranko v bazo</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <CustomerForm userId={user.id} />
      </div>
    </div>
  )
}
