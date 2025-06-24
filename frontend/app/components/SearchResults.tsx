'use client';

import { useState, useEffect } from 'react';
import { searchMovies, Movie } from '@/services/api';
import Link from 'next/link';

const MovieCard = ({ movie }: { movie: Movie }) => (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 flex flex-col">
        <div className="relative w-full" style={{ paddingTop: '150%' }}>
            {movie.poster_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm text-center p-2">No Poster</span>
                </div>
            )}
        </div>
        <div className="p-3 mt-auto">
            <h3 className="font-bold text-md truncate">{movie.title}</h3>
            <p className="text-sm text-gray-400">{movie.release_date?.substring(0, 4)}</p>
        </div>
    </div>
);

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