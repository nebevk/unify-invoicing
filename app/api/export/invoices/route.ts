import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', user.id)
    .gte('invoice_date', `${year}-01-01`)
    .lte('invoice_date', `${year}-12-31`)
    .order('invoice_date')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Generate CSV
  const headers = [
    'Številka',
    'Datum',
    'Stranka',
    'Naslov',
    'Davčna št.',
    'Opis storitve',
    'Količina',
    'Cena',
    'Skupaj',
    'Status',
    'Datum plačila',
  ]

  const rows = invoices?.map((inv) => [
    inv.invoice_number,
    inv.invoice_date,
    inv.customer_name,
    `"${inv.customer_address.replace(/"/g, '""')}"`,
    inv.customer_tax_id || '',
    `"${inv.service_description.replace(/"/g, '""')}"`,
    inv.quantity,
    inv.unit_price,
    inv.total_amount,
    inv.payment_status,
    inv.paid_date || '',
  ])

  const csv = [headers.join(','), ...(rows?.map((row) => row.join(',')) || [])].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="racuni-${year}.csv"`,
    },
  })
}
