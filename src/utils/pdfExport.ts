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
  
  // Color palette for professional look
  const colors = {
    primary: [41, 98, 255] as [number, number, number],      // Blue
    secondary: [76, 175, 80] as [number, number, number],    // Green
    accent: [255, 152, 0] as [number, number, number],       // Orange
    danger: [244, 67, 54] as [number, number, number],       // Red
    dark: [33, 37, 41] as [number, number, number],          // Dark gray
    light: [248, 249, 250] as [number, number, number],      // Light gray
    white: [255, 255, 255] as [number, number, number],      // White
    border: [220, 220, 220] as [number, number, number],     // Light border
    headerBg: [248, 249, 250] as [number, number, number],   // Header background
    alternateRow: [252, 252, 252] as [number, number, number] // Alternate row color
  }
  
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
  const margin = 15
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
    // Header background
    pdf.setFillColor(...colors.headerBg)
    pdf.rect(0, 0, pageWidth, 25, 'F')
    
    // Main title with enhanced typography
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.primary)
    pdf.text('Friendz Youth', pageWidth / 2, 12, { align: 'center' })
    
    pdf.setFontSize(14)
    pdf.setTextColor(...colors.dark)
    pdf.text('Analytics Report', pageWidth / 2, 18, { align: 'center' })
    
    currentY = 30
    
    // Date and time info with better styling
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.dark)
    const reportDate = `Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}`
    pdf.text(reportDate, pageWidth / 2, currentY, { align: 'center' })
    currentY += 8
    
    // Decorative line with color
    pdf.setDrawColor(...colors.primary)
    pdf.setLineWidth(0.5)
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    pdf.setDrawColor(0, 0, 0) // Reset to black
    pdf.setLineWidth(0.2) // Reset line width
    currentY += 12
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

  // Add Summary Section with enhanced styling
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.primary)
  pdf.text('EXECUTIVE SUMMARY', margin, currentY)
  currentY += 12

  // Summary cards background
  const cardHeight = 50
  pdf.setFillColor(...colors.light)
  pdf.roundedRect(margin, currentY, pageWidth - 2 * margin, cardHeight, 3, 3, 'F')
  
  // Summary statistics with better layout
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.dark)
  
  const summaryY = currentY + 8
  const col1X = margin + 10
  const col2X = margin + (pageWidth - 2 * margin) / 2 + 10
  
  // Left column
  pdf.text('Total Amount:', col1X, summaryY)
  pdf.setTextColor(...colors.secondary)
  pdf.text(formatCurrency(overallStats.totalAmount), col1X, summaryY + 8)
  
  pdf.setTextColor(...colors.dark)
  pdf.text('Total Paid:', col1X, summaryY + 20)
  pdf.setTextColor(...colors.secondary)
  pdf.text(formatCurrency(overallStats.totalPaid), col1X, summaryY + 28)
  
  // Right column
  pdf.setTextColor(...colors.dark)
  pdf.text('Total Due:', col2X, summaryY)
  pdf.setTextColor(...colors.danger)
  pdf.text(formatCurrency(overallStats.totalDue), col2X, summaryY + 8)
  
  pdf.setTextColor(...colors.dark)
  pdf.text('Total Items:', col2X, summaryY + 20)
  pdf.setTextColor(...colors.accent)
  pdf.text(overallStats.totalItems.toString(), col2X, summaryY + 28)

  currentY += cardHeight + 15

  // Category breakdown with enhanced table design
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.primary)
  pdf.text('CATEGORY BREAKDOWN', margin, currentY)
  currentY += 12

  // Table header with background
  const tableStartY = currentY
  const headerHeight = 8
  const rowHeight = 7
  const colWidths = [50, 20, 35, 35, 35]
  const colPositions = [margin]
  for (let i = 1; i < colWidths.length; i++) {
    colPositions[i] = colPositions[i - 1] + colWidths[i - 1]
  }

  // Header background
  pdf.setFillColor(...colors.primary)
  pdf.rect(margin, currentY, pageWidth - 2 * margin, headerHeight, 'F')
  
  // Header text
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...colors.white)
  const headers = ['Category', 'Count', 'Total', 'Paid', 'Due']
  headers.forEach((header, index) => {
    pdf.text(header, colPositions[index] + 2, currentY + 5)
  })
  currentY += headerHeight

  // Table rows with alternating colors
  pdf.setFont('helvetica', 'normal')
  categoryTotals.forEach((category, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(...colors.alternateRow)
      pdf.rect(margin, currentY, pageWidth - 2 * margin, rowHeight, 'F')
    }
    
    pdf.setTextColor(...colors.dark)
    pdf.text(category.name, colPositions[0] + 2, currentY + 5)
    pdf.text(category.count.toString(), colPositions[1] + 2, currentY + 5)
    
    // Color-coded amounts
    pdf.setTextColor(...colors.dark)
    pdf.text(formatCurrency(category.total), colPositions[2] + 2, currentY + 5)
    
    pdf.setTextColor(...colors.secondary)
    pdf.text(formatCurrency(category.paid), colPositions[3] + 2, currentY + 5)
    
    pdf.setTextColor(...colors.danger)
    pdf.text(formatCurrency(category.due), colPositions[4] + 2, currentY + 5)
    
    currentY += rowHeight
  })

  // Table border
  pdf.setDrawColor(...colors.border)
  pdf.setLineWidth(0.3)
  pdf.rect(margin, tableStartY, pageWidth - 2 * margin, headerHeight + (categoryTotals.length * rowHeight))

  currentY += 15

  // Function to create detailed table for each category with enhanced styling
  const createDetailedTable = (title: string, items: any[], columns: string[], getValue: (item: any, column: string) => string) => {
    checkPageBreak(25)
    
    // Section title with colored background
    pdf.setFillColor(...colors.light)
    pdf.rect(margin, currentY - 2, pageWidth - 2 * margin, 12, 'F')
    
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.primary)
    pdf.text(title, margin + 5, currentY + 6)
    currentY += 15

    if (items.length === 0) {
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'italic')
      pdf.setTextColor(...colors.dark)
      pdf.text('No items found', margin + 5, currentY)
      currentY += 20
      return
    }

    // Calculate column widths dynamically
    const tableWidth = pageWidth - 2 * margin
    const colWidth = tableWidth / columns.length
    const headerHeight = 8
    const rowHeight = 6
    
    // Table header with gradient-like effect
    pdf.setFillColor(...colors.primary)
    pdf.rect(margin, currentY, tableWidth, headerHeight, 'F')
    
    // Header text
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(...colors.white)
    columns.forEach((col, index) => {
      const xPos = margin + (index * colWidth) + 2
      pdf.text(col, xPos, currentY + 5)
    })
    currentY += headerHeight

    // Table rows with enhanced styling
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    
    items.forEach((item, itemIndex) => {
      checkPageBreak(rowHeight + 2)
      
      // Alternate row background
      if (itemIndex % 2 === 0) {
        pdf.setFillColor(...colors.alternateRow)
        pdf.rect(margin, currentY, tableWidth, rowHeight, 'F')
      }
      
      columns.forEach((col, colIndex) => {
        const value = getValue(item, col)
        let displayText = value.length > 18 ? value.substring(0, 18) + '...' : value
        const xPos = margin + (colIndex * colWidth) + 2
        
        // Color coding for specific columns
        if (col === 'Amount' || col === 'Total') {
          pdf.setTextColor(...colors.dark)
        } else if (col === 'Paid') {
          pdf.setTextColor(...colors.secondary)
        } else if (col === 'Due') {
          pdf.setTextColor(...colors.danger)
        } else {
          pdf.setTextColor(...colors.dark)
        }
        
        pdf.text(displayText, xPos, currentY + 4)
      })
      currentY += rowHeight
    })

    // Table border
    pdf.setDrawColor(...colors.border)
    pdf.setLineWidth(0.3)
    const tableHeight = headerHeight + (items.length * rowHeight)
    pdf.rect(margin, currentY - tableHeight, tableWidth, tableHeight)
    
    // Reset colors
    pdf.setTextColor(0, 0, 0)
    pdf.setDrawColor(0, 0, 0)
    pdf.setLineWidth(0.2)

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

  // Add enhanced footer with page numbers and branding
  const totalPages = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    
    // Footer background
    pdf.setFillColor(...colors.light)
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F')
    
    // Footer content
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(...colors.dark)
    
    // Left side - Company name
    pdf.text('Friendz Youth - Analytics Report', margin, pageHeight - 6)
    
    // Right side - Page numbers
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' })
    
    // Center - Generation timestamp
    const timestamp = new Date().toLocaleString('en-IN')
    pdf.text(`Generated: ${timestamp}`, pageWidth / 2, pageHeight - 6, { align: 'center' })
  }

  // Save the PDF
  const fileName = `Friendz_Youth_Analytics_${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}
