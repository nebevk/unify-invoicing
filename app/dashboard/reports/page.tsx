import { createClient } from '@/lib/supabase/server'
import { format, startOfYear, endOfYear, eachMonthOfInterval, parseISO } from 'date-fns'
import { sl } from 'date-fns/locale'

export default async function ReportsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const currentYear = new Date().getFullYear()
  const yearStart = startOfYear(new Date(currentYear, 0, 1))
  const yearEnd = endOfYear(new Date(currentYear, 11, 31))

  // Fetch all invoices for current year
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user!.id)
    .gte('invoice_date', yearStart.toISOString().split('T')[0])
    .lte('invoice_date', yearEnd.toISOString().split('T')[0])

  // Fetch all expenses for current year
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user!.id)
    .gte('expense_date', yearStart.toISOString().split('T')[0])
    .lte('expense_date', yearEnd.toISOString().split('T')[0])

  // Calculate monthly revenue
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })
  const monthlyData = months.map((month) => {
    const monthStr = format(month, 'yyyy-MM')

    const monthRevenue =
      invoices
        ?.filter((inv) => inv.invoice_date.startsWith(monthStr) && inv.payment_status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

    const monthExpenses =
      expenses
        ?.filter((exp) => exp.expense_date.startsWith(monthStr))
        .reduce((sum, exp) => sum + Number(exp.amount), 0) || 0

    return {
      month: format(month, 'MMMM', { locale: sl }),
      monthStr,
      revenue: monthRevenue,
      expenses: monthExpenses,
      profit: monthRevenue - monthExpenses,
    }
  })

  // Calculate totals
  const totalRevenue = monthlyData.reduce((sum, m) => sum + m.revenue, 0)
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0)
  const totalProfit = totalRevenue - totalExpenses

  // Revenue by customer
  const customerRevenue = invoices
    ?.filter((inv) => inv.payment_status === 'paid')
    .reduce((acc, inv) => {
      const existing = acc.find((c) => c.customer_id === inv.customer_id)
      if (existing) {
        existing.revenue += Number(inv.total_amount)
        existing.count += 1
      } else {
        acc.push({
          customer_id: inv.customer_id,
          customer_name: inv.customer_name,
          revenue: Number(inv.total_amount),
          count: 1,
        })
      }
      return acc
    }, [] as { customer_id: string; customer_name: string; revenue: number; count: number }[])
    .sort((a, b) => b.revenue - a.revenue) || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Poročila</h1>
        <p className="text-gray-600 mt-1">Pregled prihodkov in stroškov za leto {currentYear}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Skupni prihodki</p>
          <p className="text-3xl font-bold text-green-600">{totalRevenue.toFixed(2)} €</p>
          <p className="text-xs text-gray-500 mt-1">
            {invoices?.filter((i) => i.payment_status === 'paid').length || 0} plačanih računov
          </p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Skupni stroški</p>
          <p className="text-3xl font-bold text-red-600">{totalExpenses.toFixed(2)} €</p>
          <p className="text-xs text-gray-500 mt-1">{expenses?.length || 0} stroškov</p>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-600 mb-2">Dobiček</p>
          <p className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {totalProfit.toFixed(2)} €
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}% marža
          </p>
        </div>
      </div>

      {/* Monthly P&L Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mesečni P&L (Profit & Loss)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mesec
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prihodki
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stroški
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dobiček
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyData.map((data) => (
                <tr key={data.monthStr} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600 font-semibold">
                    {data.revenue.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600 font-semibold">
                    {data.expenses.toFixed(2)} €
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-bold ${
                    data.profit >= 0 ? 'text-blue-600' : 'text-red-600'
                  }`}>
                    {data.profit.toFixed(2)} €
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">SKUPAJ</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                  {totalRevenue.toFixed(2)} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                  {totalExpenses.toFixed(2)} €
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${
                  totalProfit >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {totalProfit.toFixed(2)} €
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Customer */}
      {customerRevenue.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Prihodki po strankah</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stranka
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Število računov
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skupni prihodki
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customerRevenue.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {customer.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                      {customer.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-green-600">
                      {customer.revenue.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Option */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Izvoz za davčno napoved</h3>
        <p className="text-blue-700 text-sm mb-4">
          Za letno davčno napoved potrebujete CSV izvoz vseh računov in stroškov.
        </p>
        <div className="flex space-x-4">
          <a
            href={`/api/export/invoices?year=${currentYear}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Izvozi račune (CSV)
          </a>
          <a
            href={`/api/export/expenses?year=${currentYear}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Izvozi stroške (CSV)
          </a>
        </div>
        <p className="text-xs text-blue-600 mt-3">
          Opomba: Te CSV datoteke lahko uporabite za davčno napoved ali pošljete računovodji.
        </p>
      </div>

      {totalRevenue === 0 && totalExpenses === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Ni podatkov za leto {currentYear}. Dodajte račune in stroške za prikaz poročil.
          </p>
        </div>
      )}
    </div>
  )
}
