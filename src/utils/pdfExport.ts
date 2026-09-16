import jsPDF from 'jspdf'
import type { AuctionItem, DonationItem, DuesItem, MembershipItem, SpentItem } from '@/types'

interface ExportData {
  auctionItems: AuctionItem[]
  membershipItems: MembershipItem[]
  spentItems: SpentItem[]
  donationItems: DonationItem[]
  duesItems: DuesItem[]
  year: number
}

type FinancialItem = { amount: number; paid: number; due: number }
type ReportRow = Array<string | number>

const numberValue = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const sum = (items: FinancialItem[], field: keyof FinancialItem) =>
  items.reduce((total, item) => total + numberValue(item[field]), 0)

const money = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-IN')}`

const date = (value: string) => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? '-' : parsed.toLocaleDateString('en-IN')
}

export const exportAnalyticsToPDF = async (source: ExportData) => {
  const { year } = source
  const forYear = <T extends { year: number }>(items: T[]) => items.filter((item) => Number(item.year) === year)
  const auctionItems = forYear(source.auctionItems)
  const membershipItems = forYear(source.membershipItems)
  const spentItems = forYear(source.spentItems)
  const donationItems = forYear(source.donationItems)

  const incomingItems: FinancialItem[] = [...membershipItems, ...auctionItems, ...donationItems]
  const incomingTotal = sum(incomingItems, 'amount')
  const collected = sum(incomingItems, 'paid')
  const incomingDue = sum(incomingItems, 'due')
  const expenseTotal = sum(spentItems, 'amount')
  const expensePaid = sum(spentItems, 'paid')
  const expenseDue = sum(spentItems, 'due')
  const accountBalance = collected - expensePaid
  const collectionProgress = incomingTotal > 0 ? (collected / incomingTotal) * 100 : 0
  const paymentStatus = incomingItems.reduce(
    (status, item) => {
      if (numberValue(item.due) <= 0) status.paid += 1
      else if (numberValue(item.paid) > 0) status.partial += 1
      else status.due += 1
      return status
    },
    { paid: 0, partial: 0, due: 0 }
  )

  const categories = [
    { name: 'Membership', items: membershipItems, unit: 'people' },
    { name: 'Expenses', items: spentItems, unit: 'items' },
    { name: 'Auction', items: auctionItems, unit: 'items' },
    { name: 'Donations', items: donationItems, unit: 'people' },
  ]

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  const footerTop = pageHeight - 15
  let y = 0

  const colors = {
    navy: [7, 27, 37] as const,
    panel: [16, 42, 54] as const,
    teal: [52, 211, 153] as const,
    cyan: [34, 211, 238] as const,
    orange: [251, 146, 60] as const,
    rose: [251, 113, 133] as const,
    slate: [71, 85, 105] as const,
    pale: [241, 245, 249] as const,
    white: [255, 255, 255] as const,
    ink: [15, 23, 42] as const,
  }

  const addPageHeader = () => {
    pdf.setFillColor(...colors.navy)
    pdf.rect(0, 0, pageWidth, 28, 'F')
    pdf.setTextColor(...colors.white)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(17)
    pdf.text('Friendz Youth - Choller', margin, 12)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Annual Financial Report | ${year}`, margin, 20)
    pdf.text(`Generated ${new Date().toLocaleString('en-IN')}`, pageWidth - margin, 20, { align: 'right' })
    y = 36
  }

  const newPage = () => {
    pdf.addPage()
    addPageHeader()
  }

  const ensureSpace = (height: number) => {
    if (y + height > footerTop) newPage()
  }

  const sectionTitle = (title: string, subtitle?: string) => {
    ensureSpace(subtitle ? 19 : 13)
    pdf.setFillColor(...colors.panel)
    pdf.roundedRect(margin, y, contentWidth, subtitle ? 16 : 11, 2, 2, 'F')
    pdf.setTextColor(...colors.white)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.text(title, margin + 4, y + 7)
    if (subtitle) {
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)
      pdf.setTextColor(203, 213, 225)
      pdf.text(subtitle, margin + 4, y + 12)
    }
    y += subtitle ? 20 : 15
  }

  const metricGrid = (metrics: Array<{ label: string; value: string; color?: readonly [number, number, number] }>) => {
    const columns = 2
    const gap = 4
    const cardWidth = (contentWidth - gap) / columns
    const cardHeight = 22
    metrics.forEach((metric, index) => {
      if (index % columns === 0) ensureSpace(cardHeight)
      const x = margin + (index % columns) * (cardWidth + gap)
      const rowY = y
      pdf.setFillColor(...colors.pale)
      pdf.roundedRect(x, rowY, cardWidth, cardHeight, 2, 2, 'F')
      pdf.setTextColor(...colors.slate)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(8)
      pdf.text(metric.label.toUpperCase(), x + 4, rowY + 7)
      pdf.setTextColor(...(metric.color ?? colors.ink))
      pdf.setFontSize(14)
      pdf.text(metric.value, x + 4, rowY + 16)
      if (index % columns === columns - 1 || index === metrics.length - 1) y += cardHeight + 4
    })
  }

  const drawTable = (title: string, headers: string[], rows: ReportRow[], widths: number[]) => {
    sectionTitle(title, `${rows.length} record${rows.length === 1 ? '' : 's'} for ${year}`)
    if (rows.length === 0) {
      pdf.setTextColor(...colors.slate)
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(9)
      pdf.text(`No ${title.toLowerCase()} recorded for ${year}.`, margin + 2, y + 3)
      y += 11
      return
    }

    const drawHeader = () => {
      ensureSpace(10)
      pdf.setFillColor(...colors.slate)
      pdf.rect(margin, y, contentWidth, 9, 'F')
      pdf.setTextColor(...colors.white)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(7.5)
      let x = margin
      headers.forEach((header, index) => {
        pdf.text(header, x + 2, y + 6)
        x += widths[index]
      })
      y += 9
    }

    drawHeader()
    rows.forEach((row, rowIndex) => {
      const cells = row.map((value, index) => pdf.splitTextToSize(String(value ?? '-'), widths[index] - 4) as string[])
      const lines = Math.max(...cells.map((cell) => cell.length), 1)
      const rowHeight = Math.max(8, lines * 3.5 + 3)
      if (y + rowHeight > footerTop) {
        newPage()
        drawHeader()
      }
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(248, 250, 252)
        pdf.rect(margin, y, contentWidth, rowHeight, 'F')
      }
      pdf.setDrawColor(226, 232, 240)
      pdf.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(7.5)
      let x = margin
      cells.forEach((cell, index) => {
        const header = headers[index]
        if (header === 'Paid') pdf.setTextColor(5, 150, 105)
        else if (header === 'Due') pdf.setTextColor(225, 29, 72)
        else pdf.setTextColor(...colors.ink)
        pdf.text(cell, x + 2, y + 5)
        x += widths[index]
      })
      y += rowHeight
    })
    y += 7
  }

  addPageHeader()
  sectionTitle('FINANCIAL OVERVIEW', 'Income = Membership + Auction + Donations | Outgoing = Expenses')
  metricGrid([
    { label: 'Account balance', value: money(accountBalance), color: accountBalance >= 0 ? colors.cyan : colors.rose },
    { label: 'Incoming total', value: money(incomingTotal) },
    { label: 'Collected', value: money(collected), color: colors.teal },
    { label: 'Incoming due', value: money(incomingDue), color: colors.orange },
    { label: 'Expenses total', value: money(expenseTotal) },
    { label: 'Expenses paid', value: money(expensePaid), color: colors.rose },
    { label: 'Expenses due', value: money(expenseDue), color: colors.rose },
    { label: 'Collection progress', value: `${collectionProgress.toFixed(1)}%`, color: colors.teal },
  ])

  sectionTitle('INCOMING PAYMENT STATUS', `${incomingItems.length} income records`)
  metricGrid([
    { label: 'Fully paid', value: String(paymentStatus.paid), color: colors.teal },
    { label: 'Partially paid', value: String(paymentStatus.partial), color: colors.orange },
    { label: 'Unpaid / due', value: String(paymentStatus.due), color: colors.rose },
    { label: 'Total records', value: String(incomingItems.length) },
  ])

  sectionTitle('CATEGORY SUMMARY', `All dashboard sections for ${year}`)
  drawTable(
    'SUMMARY BY SECTION',
    ['Section', 'Entries', 'Total', 'Paid', 'Due'],
    categories.map((category) => [
      category.name,
      `${category.items.length} ${category.unit}`,
      money(sum(category.items, 'amount')),
      money(sum(category.items, 'paid')),
      money(sum(category.items, 'due')),
    ]),
    [40, 30, 37, 37, 36]
  )

  drawTable(
    'MEMBERSHIP DETAILS',
    ['Name', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    membershipItems.map((item) => [item.name, money(item.amount), money(item.paid), money(item.due), item.comment || '-', date(item.created_at)]),
    [40, 25, 25, 25, 45, 20]
  )
  drawTable(
    'AUCTION DETAILS',
    ['Name', 'Item', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    auctionItems.map((item) => [item.name, item.item, money(item.amount), money(item.paid), money(item.due), item.comment || '-', date(item.created_at)]),
    [30, 30, 24, 24, 24, 30, 18]
  )
  drawTable(
    'DONATION DETAILS',
    ['Name', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    donationItems.map((item) => [item.name, money(item.amount), money(item.paid), money(item.due), item.comment || '-', date(item.created_at)]),
    [40, 25, 25, 25, 45, 20]
  )
  drawTable(
    'EXPENSE DETAILS',
    ['Item', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    spentItems.map((item) => [item.item, money(item.amount), money(item.paid), money(item.due), item.comment || '-', date(item.created_at)]),
    [40, 25, 25, 25, 45, 20]
  )

  const totalPages = pdf.getNumberOfPages()
  for (let page = 1; page <= totalPages; page += 1) {
    pdf.setPage(page)
    pdf.setFillColor(...colors.navy)
    pdf.rect(0, footerTop, pageWidth, 15, 'F')
    pdf.setTextColor(203, 213, 225)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.text(`Friendz Youth - Choller | ${year}`, margin, pageHeight - 6)
    pdf.text(`Page ${page} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' })
  }

  pdf.save(`Friendz_Youth_Financial_Report_${year}.pdf`)
}
