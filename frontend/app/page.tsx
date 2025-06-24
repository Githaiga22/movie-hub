'use client';

import React, { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { MovieCarousel } from '@/app/components/MovieCarousel';
import { SearchResults } from '@/app/components/SearchResults';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero and Search Section */}
      <section className="flex flex-col items-center justify-center py-12 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center">
          Discover Movies & TV Shows
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8 text-center max-w-2xl">
          Search, explore, and build your watchlist. Your next favorite movie or show is just a click away!
        </p>
        <div className="w-full max-w-xl relative">
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            className="w-full px-6 py-3 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-lg shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>
      
      {/* Conditional Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {debouncedSearchQuery ? (
          <SearchResults query={debouncedSearchQuery} />
        ) : (
          <>
            <MovieCarousel category="now_playing" title="Now Playing" />
            <MovieCarousel category="popular" title="Popular" />
            <MovieCarousel category="top_rated" title="Top Rated" />
            <MovieCarousel category="upcoming" title="Upcoming" />
          </>
        )}
      </div>
    </main>
  );
}
