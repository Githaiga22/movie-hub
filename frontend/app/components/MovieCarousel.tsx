'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getMovieList, Movie } from '@/services/api';
import Link from 'next/link';

const MovieCard = ({ movie }: { movie: Movie }) => (
    <div className="flex-shrink-0 w-40 md:w-48 transform transition-transform duration-300 hover:scale-105">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
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
                <h3 className="font-bold text-sm truncate">{movie.title}</h3>
                <p className="text-xs text-gray-400">{movie.release_date?.substring(0, 4)}</p>
            </div>
        </div>
    </div>
);


interface MovieCarouselProps {
    category: string;
    title: string;
}

export const MovieCarousel = ({ category, title }: MovieCarouselProps) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastMovieElementRef = useCallback((node: Element | null) => {
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
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await getMovieList(category, page);
                setMovies(prevMovies => {
                    const movieMap = new Map();
                    prevMovies.forEach(movie => movieMap.set(movie.id, movie));
                    data.results.forEach(movie => movieMap.set(movie.id, movie));
                    return Array.from(movieMap.values());
                });
                setHasMore(data.page < data.total_pages);
            } catch (error) {
                console.error(`Failed to load ${category} movies`, error);
            }
            setLoading(false);
        };
        fetchMovies();
    }, [category, page]);

    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
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
                {loading && <div className="text-white">Loading...</div>}
            </div>
        </section>
    );
}; 