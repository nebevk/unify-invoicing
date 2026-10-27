import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { Invoice } from './types'
import { DEFAULT_COMPANY_DETAILS } from './types'

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export function generateInvoicePDF(invoice: Invoice): jsPDF {
  const doc = new jsPDF()

  // Company header
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(DEFAULT_COMPANY_DETAILS.name, 20, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(DEFAULT_COMPANY_DETAILS.address, 20, 27)
  doc.text(`Davčna št.: ${DEFAULT_COMPANY_DETAILS.tax_id}`, 20, 32)
  doc.text(`Matična št.: ${DEFAULT_COMPANY_DETAILS.registration_id}`, 20, 37)
  doc.text(DEFAULT_COMPANY_DETAILS.email, 20, 42)

  // Invoice title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('RAČUN', 150, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Številka: ${invoice.invoice_number}`, 150, 27)
  doc.text(`Datum: ${new Date(invoice.invoice_date).toLocaleDateString('sl-SI')}`, 150, 32)
  if (invoice.due_date) {
    doc.text(`Rok plačila: ${new Date(invoice.due_date).toLocaleDateString('sl-SI')}`, 150, 37)
  }

  // Customer section
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Prejemnik računa:', 20, 55)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(invoice.customer_name, 20, 62)
  const addressLines = invoice.customer_address.split('\n')
  addressLines.forEach((line, i) => {
    doc.text(line, 20, 67 + i * 5)
  })
  let yPos = 67 + addressLines.length * 5
  if (invoice.customer_tax_id) {
    doc.text(`Davčna št.: ${invoice.customer_tax_id}`, 20, yPos)
    yPos += 5
  }
  if (invoice.customer_registration_id) {
    doc.text(`Matična št.: ${invoice.customer_registration_id}`, 20, yPos)
    yPos += 5
  }

  // Items table
  const startY = Math.max(yPos + 10, 95)

  doc.autoTable({
    startY: startY,
    head: [['Opis storitve', 'Količina', 'Cena/enoto', 'Skupaj']],
    body: [
      [
        invoice.service_description,
        invoice.quantity.toString(),
        `${Number(invoice.unit_price).toFixed(2)} €`,
        `${Number(invoice.total_amount).toFixed(2)} €`,
      ],
    ],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255 },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
    },
  })

  // Total
  const finalY = (doc as any).lastAutoTable.finalY || startY + 20
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('SKUPAJ ZA PLAČILO:', 130, finalY + 10)
  doc.setFontSize(14)
  doc.text(`${Number(invoice.total_amount).toFixed(2)} €`, 175, finalY + 10)

  // Non-VAT notice (Unify is NOT VAT-registered)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text('Zavezanec ni identificiran za namene DDV.', 20, finalY + 20)

  // Payment details
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Plačilo na transakcijski račun:', 20, finalY + 30)
  doc.setFont('helvetica', 'bold')
  doc.text(DEFAULT_COMPANY_DETAILS.bank, 20, finalY + 35)
  doc.setFont('helvetica', 'normal')
  doc.text(`Banka: ${DEFAULT_COMPANY_DETAILS.bank_name}`, 20, finalY + 40)
  doc.text(`Namen: Račun ${invoice.invoice_number}`, 20, finalY + 45)

  // Notes
  if (invoice.notes) {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    doc.text(`Opombe: ${invoice.notes}`, 20, finalY + 55, { maxWidth: 170 })
  }

  // Footer
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Hvala za vaše zaupanje!', 105, 280, { align: 'center' })

  return doc
}
