// Test file to verify PDF export functionality works correctly
// This is not meant to be run in production, just for development testing

const testData = {
  auctionItems: [
    {
      id: '1',
      user_id: 'test',
      name: 'John Doe',
      item: 'Painting',
      amount: 5000,
      paid: 3000,
      due: 2000,
      comment: 'Beautiful artwork',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      user_id: 'test',
      name: 'Jane Smith',
      item: 'Sculpture',
      amount: 8000,
      paid: 8000,
      due: 0,
      comment: 'Modern art piece',
      created_at: '2024-01-16T14:20:00Z',
      updated_at: '2024-01-16T14:20:00Z'
    }
  ],
  membershipItems: [
    {
      id: '3',
      user_id: 'test',
      name: 'Alice Johnson',
      amount: 1200,
      paid: 1200,
      due: 0,
      comment: 'Annual membership',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-10T09:15:00Z'
    }
  ],
  spentItems: [
    {
      id: '4',
      user_id: 'test',
      item: 'Office Supplies',
      amount: 500,
      paid: 500,
      due: 0,
      comment: 'Stationery and equipment',
      created_at: '2024-01-12T11:45:00Z',
      updated_at: '2024-01-12T11:45:00Z'
    }
  ],
  donationItems: [
    {
      id: '5',
      user_id: 'test',
      name: 'Bob Wilson',
      amount: 2500,
      paid: 1500,
      due: 1000,
      comment: 'Charity donation',
      created_at: '2024-01-14T16:30:00Z',
      updated_at: '2024-01-14T16:30:00Z'
    }
  ],
  duesItems: [
    {
      id: '6',
      user_id: 'test',
      name: 'Carol Brown',
      amount: 750,
      paid: 0,
      due: 750,
      comment: 'Monthly dues',
      created_at: '2024-01-13T08:20:00Z',
      updated_at: '2024-01-13T08:20:00Z'
    }
  ]
}

// Expected calculations for verification:
// Total Amount: 5000 + 8000 + 1200 + 500 + 2500 + 750 = 17,950
// Total Paid: 3000 + 8000 + 1200 + 500 + 1500 + 0 = 14,200
// Total Due: 2000 + 0 + 0 + 0 + 1000 + 750 = 3,750
// Total Items: 6

console.log('Test data for PDF export:')
console.log('Expected totals:')
console.log('- Total Amount: ₹17,950')
console.log('- Total Paid: ₹14,200')
console.log('- Total Due: ₹3,750')
console.log('- Total Items: 6')

export { testData }
