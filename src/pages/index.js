// pages/index.js
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>Hong's Kitchen</title>
        <meta
          name="description"
          content="Hong's Kitchen - Delicious Chinese Cuisine"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-4 px-4 md:px-10 flex justify-center items-center bg-white shadow-sm">
        <Link href="/">
          <div className="w-32 md:w-40 cursor-pointer">
            <img
              src="https://hongskitchen.in/jfl-discovery-ui/public/dist/default/images/global/loginLogoHK.svg"
              alt="Hong's Kitchen Logo"
              className="w-full"
            />
          </div>
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Welcome to Hong's Kitchen
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Experience authentic Chinese cuisine with a modern twist
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl justify-center">
          {/* View Menu Button */}
          <Link href="/view-menu">
            <div className="flex-1 cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-teal-500 bg-opacity-95 hover:bg-opacity-100 text-white text-center p-8 transform hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h2 className="text-2xl font-bold mb-2">View Menu</h2>
                <p className="text-sm opacity-90">
                  Explore our delicious offerings
                </p>
              </div>
            </div>
          </Link>

          {/* Place Order Button */}
          <Link href="/place-order">
            <div className="flex-1 cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-red-500 bg-opacity-95 hover:bg-opacity-100 text-white text-center p-8 transform hover:scale-105">
              <div className="flex flex-col items-center justify-center h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h2 className="text-2xl font-bold mb-2">Place Your Order</h2>
                <p className="text-sm opacity-90">Quick and easy ordering</p>
              </div>
            </div>
          </Link>
        </div>
      </main>

      <footer className="py-6 px-4 bg-gray-50 text-center text-gray-600 border-t border-gray-100">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Hong's Kitchen. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
