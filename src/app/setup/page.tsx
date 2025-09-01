'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SetupPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const createTables = async () => {
    setLoading(true)
    setStatus('Creating database tables...')

    try {
      // Create tabs table
      const { error: tabsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS tabs (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
          );
        `
      })

      if (tabsError) {
        setStatus(`Error creating tabs table: ${tabsError.message}`)
        setLoading(false)
        return
      }

      // Create tab_items table
      const { error: itemsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS tab_items (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            item VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL DEFAULT 0,
            tab_id UUID NOT NULL REFERENCES tabs(id) ON DELETE CASCADE,
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
          );
        `
      })

      if (itemsError) {
        setStatus(`Error creating tab_items table: ${itemsError.message}`)
        setLoading(false)
        return
      }

      setStatus('Database tables created successfully! You can now go to the dashboard.')
    } catch (error) {
      setStatus(`Setup failed. Please create the tables manually in Supabase SQL Editor using the provided schema.`)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Database Setup</h1>
        
        <p className="text-gray-600 mb-6">
          Before using the dashboard, you need to create the required database tables in Supabase.
        </p>

        <div className="space-y-4">
          <button
            onClick={createTables}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Setting up...' : 'Create Database Tables'}
          </button>

          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes('Error') || status.includes('failed')
                ? 'bg-red-50 text-red-800'
                : status.includes('successfully')
                ? 'bg-green-50 text-green-800'
                : 'bg-blue-50 text-blue-800'
            }`}>
              {status}
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">Manual Setup Instructions:</h3>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Go to your Supabase project dashboard</li>
              <li>Navigate to SQL Editor</li>
              <li>Copy the SQL from <code>database-schema.sql</code></li>
              <li>Paste and execute the queries</li>
              <li>Return to the dashboard</li>
            </ol>
          </div>

          <a
            href="/dashboard"
            className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
