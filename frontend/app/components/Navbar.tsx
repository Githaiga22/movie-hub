import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
    return (
        <header className="bg-gray-900 text-white shadow-md">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-extrabold text-red-500">
                            MovieHub
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/watchlist" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                            My Watchlist
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}; 