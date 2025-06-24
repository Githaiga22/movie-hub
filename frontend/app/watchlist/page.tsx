'use client';

import React from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { MovieCard } from '@/app/components/MovieCard';
import Link from 'next/link';

export default function WatchlistPage() {
  const { watchlist, isMovieWatched, toggleWatched } = useWatchlist();

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Your Watchlist is Empty</h1>
        <p className="text-gray-400">Add some movies to see them here.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist ({watchlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {watchlist.map(movie => {
          const isWatched = isMovieWatched(movie.id);

          const handleWatchedToggle = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWatched(movie.id);
          }

          return (
            <div key={movie.id} className="relative">
              <div className={`${isWatched ? 'opacity-50' : ''}`}>
                <MovieCard movie={movie} />
              </div>
              <button
                onClick={handleWatchedToggle}
                title={isWatched ? 'Unmark as watched' : 'Mark as watched'}
                className={`absolute top-2 right-10 p-2 rounded-full text-white transition-colors z-20 ${
                  isWatched ? 'bg-sky-500 hover:bg-sky-600' : 'bg-black/50 hover:bg-black/75'
                }`}
              >
                {/* Eye Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
} 