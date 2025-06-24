'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getGenreList, Genre } from '@/services/api';

const GenresDropdown = () => {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await getGenreList();
                setGenres(data.genres);
            } catch (error) {
                console.error("Failed to fetch genres for dropdown", error);
            }
        };
        fetchGenres();
    }, []);

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <button
                onMouseEnter={() => setIsOpen(true)}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none"
            >
                Genres
            </button>
            {isOpen && (
                <div 
                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-20"
                >
                    <div className="py-1 grid grid-cols-2 gap-1">
                        {genres.map(genre => (
                            <Link
                                key={genre.id}
                                href={`/genre/${genre.id}?name=${genre.name}`}
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                {genre.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Navbar = () => {
    return (
        <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-extrabold text-red-500">
                            MovieHub
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <GenresDropdown />
                        <Link href="/watchlist" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                            My Watchlist
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}; 