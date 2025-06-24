'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getMovieList, Movie } from '@/services/api';
import Link from 'next/link';
import { MovieCard } from './MovieCard';

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