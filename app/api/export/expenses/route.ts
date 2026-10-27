import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const year = searchParams.get('year') || new Date().getFullYear().toString()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', user.id)
    .gte('expense_date', `${year}-01-01`)
    .lte('expense_date', `${year}-12-31`)
    .order('expense_date')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Generate CSV
  const headers = ['Datum', 'Znesek', 'Kategorija', 'Opis', 'Dobavitelj', 'Opombe']

  const rows = expenses?.map((exp) => [
    exp.expense_date,
    exp.amount,
    categoryLabels[exp.category] || exp.category,
    `"${exp.description.replace(/"/g, '""')}"`,
    exp.vendor_name || '',
    exp.notes ? `"${exp.notes.replace(/"/g, '""')}"` : '',
  ])

  const csv = [headers.join(','), ...(rows?.map((row) => row.join(',')) || [])].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="stroski-${year}.csv"`,
    },
  })
}
