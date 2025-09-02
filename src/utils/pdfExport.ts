import jsPDF from 'jspdf'
import type { 
  AuctionItem, 
  MembershipItem, 
  SpentItem, 
  DonationItem, 
  DuesItem 
} from '@/types'

interface ExportData {
  auctionItems: AuctionItem[]
  membershipItems: MembershipItem[]
  spentItems: SpentItem[]
  donationItems: DonationItem[]
  duesItems: DuesItem[]
  user?: any
}

export const exportAnalyticsToPDF = async (data: ExportData) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  // Helper function to safely convert to number
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
  }

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    if (isNaN(amount) || !isFinite(amount)) return 'Rs. 0'
    const roundedAmount = Math.round(amount)
    // Use Rs. instead of ₹ symbol for better PDF compatibility
    return `Rs. ${roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN')
    } catch {
      return 'N/A'
    }
  }

  // Page settings
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  let currentY = margin

  // Function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - margin) {
      pdf.addPage()
      currentY = margin
      return true
    }
    return false
  }

  // Function to add header to each page
  const addHeader = () => {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Friendz Youth - Analytics Report', pageWidth / 2, currentY, { align: 'center' })
    currentY += 10
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`, pageWidth / 2, currentY, { align: 'center' })
    currentY += 15
    
    // Add line separator
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 10
  }

  // Add header to first page
  addHeader()

  // Calculate totals for summary
  const categoryTotals = [
    { 
      name: 'Auction Items',
      total: data.auctionItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: data.auctionItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: data.auctionItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: data.auctionItems.length
    },
    { 
      name: 'Membership Items',
      total: data.membershipItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: data.membershipItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: data.membershipItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: data.membershipItems.length
    },
    { 
      name: 'Expense Items',
      total: data.spentItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: data.spentItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: data.spentItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: data.spentItems.length
    },
    { 
      name: 'Donation Items',
      total: data.donationItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: data.donationItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: data.donationItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: data.donationItems.length
    },
    { 
      name: 'Dues Items',
      total: data.duesItems.reduce((sum, item) => sum + safeNumber(item.amount), 0),
      paid: data.duesItems.reduce((sum, item) => sum + safeNumber(item.paid), 0),
      due: data.duesItems.reduce((sum, item) => sum + safeNumber(item.due), 0),
      count: data.duesItems.length
    }
  ]

  const overallStats = {
    totalAmount: categoryTotals.reduce((sum, cat) => sum + cat.total, 0),
    totalPaid: categoryTotals.reduce((sum, cat) => sum + cat.paid, 0),
    totalDue: categoryTotals.reduce((sum, cat) => sum + cat.due, 0),
    totalItems: categoryTotals.reduce((sum, cat) => sum + cat.count, 0)
  }

  // Add Summary Section
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('EXECUTIVE SUMMARY', margin, currentY)
  currentY += 10

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  // Overall statistics
  const summaryData = [
    ['Total Amount:', formatCurrency(overallStats.totalAmount)],
    ['Total Paid:', formatCurrency(overallStats.totalPaid)],
    ['Total Due:', formatCurrency(overallStats.totalDue)],
    ['Total Items:', overallStats.totalItems.toString()]
  ]

  summaryData.forEach(([label, value]) => {
    pdf.text(label, margin, currentY)
    pdf.text(value, margin + 50, currentY)
    currentY += 6
  })

  currentY += 10

  // Category breakdown
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('CATEGORY BREAKDOWN', margin, currentY)
  currentY += 8

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Category', margin, currentY)
  pdf.text('Count', margin + 40, currentY)
  pdf.text('Total', margin + 60, currentY)
  pdf.text('Paid', margin + 85, currentY)
  pdf.text('Due', margin + 110, currentY)
  currentY += 2
  pdf.line(margin, currentY, pageWidth - margin, currentY)
  currentY += 5

  pdf.setFont('helvetica', 'normal')
  categoryTotals.forEach((category) => {
    pdf.text(category.name, margin, currentY)
    pdf.text(category.count.toString(), margin + 40, currentY)
    pdf.text(formatCurrency(category.total), margin + 60, currentY)
    pdf.text(formatCurrency(category.paid), margin + 85, currentY)
    pdf.text(formatCurrency(category.due), margin + 110, currentY)
    currentY += 6
  })

  currentY += 15

  // Function to create detailed table for each category
  const createDetailedTable = (title: string, items: any[], columns: string[], getValue: (item: any, column: string) => string) => {
    checkPageBreak(20)
    
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(title, margin, currentY)
    currentY += 10

    if (items.length === 0) {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.text('No items found', margin, currentY)
      currentY += 15
      return
    }

    // Table headers
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'bold')
    const colWidth = (pageWidth - 2 * margin) / columns.length
    columns.forEach((col, index) => {
      pdf.text(col, margin + index * colWidth, currentY)
    })
    currentY += 2
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 5

    // Table rows
    pdf.setFont('helvetica', 'normal')
    items.forEach((item, index) => {
      checkPageBreak(8)
      
      columns.forEach((col, colIndex) => {
        const value = getValue(item, col)
        const text = value.length > 15 ? value.substring(0, 15) + '...' : value
        pdf.text(text, margin + colIndex * colWidth, currentY)
      })
      currentY += 6
      
      // Add subtle line after every 5 rows, but not after the last item
      if ((index + 1) % 5 === 0 && index < items.length - 1) {
        pdf.setDrawColor(220, 220, 220)
        pdf.line(margin, currentY, pageWidth - margin, currentY)
        pdf.setDrawColor(0, 0, 0)
        currentY += 2
      }
    })

    currentY += 15
  }

  // Auction Items Details
  createDetailedTable(
    'AUCTION ITEMS DETAILS',
    data.auctionItems,
    ['Name', 'Item', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    (item, column) => {
      switch (column) {
        case 'Name': return item.name || 'N/A'
        case 'Item': return item.item || 'N/A'
        case 'Amount': return formatCurrency(safeNumber(item.amount))
        case 'Paid': return formatCurrency(safeNumber(item.paid))
        case 'Due': return formatCurrency(safeNumber(item.due))
        case 'Comment': return item.comment || 'N/A'
        case 'Date': return formatDate(item.created_at)
        default: return 'N/A'
      }
    }
  )

  // Membership Items Details
  createDetailedTable(
    'MEMBERSHIP ITEMS DETAILS',
    data.membershipItems,
    ['Name', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    (item, column) => {
      switch (column) {
        case 'Name': return item.name || 'N/A'
        case 'Amount': return formatCurrency(safeNumber(item.amount))
        case 'Paid': return formatCurrency(safeNumber(item.paid))
        case 'Due': return formatCurrency(safeNumber(item.due))
        case 'Comment': return item.comment || 'N/A'
        case 'Date': return formatDate(item.created_at)
        default: return 'N/A'
      }
    }
  )

  // Expense Items Details
  createDetailedTable(
    'EXPENSE ITEMS DETAILS',
    data.spentItems,
    ['Item', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    (item, column) => {
      switch (column) {
        case 'Item': return item.item || 'N/A'
        case 'Amount': return formatCurrency(safeNumber(item.amount))
        case 'Paid': return formatCurrency(safeNumber(item.paid))
        case 'Due': return formatCurrency(safeNumber(item.due))
        case 'Comment': return item.comment || 'N/A'
        case 'Date': return formatDate(item.created_at)
        default: return 'N/A'
      }
    }
  )

  // Donation Items Details
  createDetailedTable(
    'DONATION ITEMS DETAILS',
    data.donationItems,
    ['Name', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    (item, column) => {
      switch (column) {
        case 'Name': return item.name || 'N/A'
        case 'Amount': return formatCurrency(safeNumber(item.amount))
        case 'Paid': return formatCurrency(safeNumber(item.paid))
        case 'Due': return formatCurrency(safeNumber(item.due))
        case 'Comment': return item.comment || 'N/A'
        case 'Date': return formatDate(item.created_at)
        default: return 'N/A'
      }
    }
  )

  // Dues Items Details
  createDetailedTable(
    'DUES ITEMS DETAILS',
    data.duesItems,
    ['Name', 'Amount', 'Paid', 'Due', 'Comment', 'Date'],
    (item, column) => {
      switch (column) {
        case 'Name': return item.name || 'N/A'
        case 'Amount': return formatCurrency(safeNumber(item.amount))
        case 'Paid': return formatCurrency(safeNumber(item.paid))
        case 'Due': return formatCurrency(safeNumber(item.due))
        case 'Comment': return item.comment || 'N/A'
        case 'Date': return formatDate(item.created_at)
        default: return 'N/A'
      }
    }
  )

  // Add footer with page numbers
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' })
    pdf.text('Friendz Youth - Analytics Report', margin, pageHeight - 10)
  }

  // Save the PDF
  const fileName = `Friendz_Youth_Analytics_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}
