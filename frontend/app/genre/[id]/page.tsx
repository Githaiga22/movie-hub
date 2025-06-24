'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getMoviesByGenre, Movie } from '@/services/api';
import { MovieCard } from '@/app/components/MovieCard';
import Link from 'next/link';

const MovieGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-lg animate-pulse" style={{ paddingBottom: '150%' }} />
      ))}
    </div>
);

export default function GenrePage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const genreId = params.id as string;
    const genreName = searchParams.get('name');

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver>();

    const lastMovieElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        // Reset state when genre changes
        setMovies([]);
        setPage(1);
        setHasMore(true);
    }, [genreId]);

    useEffect(() => {
        if (!genreId) return;
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await getMoviesByGenre(genreId, page);
                setMovies(prev => [...prev, ...data.results]);
                setHasMore(data.page < data.total_pages);
            } catch (error) {
                console.error(`Failed to load movies for genre ${genreName}`, error);
            }
            setLoading(false);
        };
        fetchMovies();
    }, [genreId, page, genreName]);

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold mb-8">
                    {genreName || 'Genre'} Movies
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {movies.map((movie, index) => {
                        const isLastElement = movies.length === index + 1;
                        return (
                            <div key={`${movie.id}-${index}`} ref={isLastElement ? lastMovieElementRef : null}>
                                <Link href={`/movie/${movie.id}`} passHref>
                                    <MovieCard movie={movie} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
                {loading && <MovieGridSkeleton />}
                {!hasMore && movies.length > 0 && <p className="text-center col-span-full mt-8">You've reached the end!</p>}
            </div>
        </main>
    );
} 