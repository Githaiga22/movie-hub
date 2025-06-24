'use client';

import { useState, useEffect } from 'react';
import { searchMovies, Movie } from '@/services/api';
import Link from 'next/link';
import { MovieCard } from './MovieCard';

const MovieGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg animate-pulse" style={{ paddingBottom: '150%' }} />
      ))}
    </div>
);

interface SearchResultsProps {
    query: string;
}

export const SearchResults = ({ query }: SearchResultsProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query) return;
        
        const fetchSearchResults = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchMovies(query);
                setMovies(data.results);
            } catch (err) {
                setError('Failed to load search results.');
                console.error(err);
            }
            setLoading(false);
        };
        
        fetchSearchResults();
    }, [query]);

    if (loading) return <MovieGridSkeleton />;
    if (error) return <div className="text-center text-red-500"><p>{error}</p></div>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Results for "{query}"</h2>
            {movies.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {movies.map(movie => (
                        <Link href={`/movie/${movie.id}`} key={movie.id} passHref>
                            <MovieCard movie={movie} />
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No results found for "{query}".</p>
            )}
        </div>
    );
}; 