import Link from "next/link";
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
                      <Image
                        src="/icons/friendyouthlogo.png"
                        alt="Friends Youth Logo"
                        width={120}
                        height={120}
                        className="object-contain"
                        priority
                      />
                    </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Friendz Youth — Choller</h1>
          <p className="mb-8 text-gray-600">Choose how you want to access the community dashboard.</p>
          
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="block w-full rounded-lg bg-emerald-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-emerald-700"
            >
              View Dashboard
            </Link>
            <Link
              href="/auth/login"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-gray-50"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
