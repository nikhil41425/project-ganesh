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
          <p className="text-gray-600 mb-8">
            Welcome to Friendz Youth Application -Choller
          </p>
          
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 block text-center"
            >
              Login
            </Link>
            
            {/* <Link
              href="/auth/register"
              className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition duration-200 block text-center"
            >
              Register
            </Link> */}

            {/* <Link
              href="/setup"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 block text-center"
            >
              Database Setup
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
