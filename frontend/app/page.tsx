'use client';

import React, { useEffect, useState } from 'react';
import { getTrendingMovies, Movie } from '../services/api';

const MovieCard = ({ movie }: { movie: Movie }) => (
  <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105">
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
      className="w-full h-auto"
    />
    <div className="p-3">
      <h3 className="font-bold text-md truncate">{movie.title}</h3>
      <p className="text-sm text-gray-400">{movie.release_date.substring(0, 4)}</p>
    </div>
  </div>
);

const MovieGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-lg animate-pulse h-64" />
    ))}
  </div>
);

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getTrendingMovies();
        setTrendingMovies(data.results);
        setError(null);
      } catch (err) {
        setError('Failed to load trending movies. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-center">
          Discover Movies & TV Shows
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-8 text-center max-w-2xl">
          Search, explore, and build your watchlist. Your next favorite movie or show is just a click away!
        </p>
        {/* Search Bar */}
        <div className="w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for movies or TV shows..."
            className="w-full px-6 py-3 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-lg shadow-lg"
            disabled // Will be enabled in a future step
          />
        </div>
      </section>
      
      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        {loading ? (
          <MovieGridSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {trendingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
