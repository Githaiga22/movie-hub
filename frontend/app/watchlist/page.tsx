'use client';

import React from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { MovieCard } from '@/app/components/MovieCard';
import Link from 'next/link';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {watchlist.map(movie => (
              <Link href={`/movie/${movie.id}`} key={movie.id} passHref>
                <MovieCard movie={movie} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">Your watchlist is empty.</p>
            <p className="mt-2 text-gray-500">Add movies from the home page or search results to see them here.</p>
            <Link href="/" className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Find Movies
            </Link>
          </div>
        )}
      </div>
    </main>
  );
} 