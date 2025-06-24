'use client';

import React from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { Movie } from '@/services/api';

const WatchlistButton = ({ movie }: { movie: Movie }) => {
    const { addMovie, removeMovie, isMovieInWatchlist } = useWatchlist();
    const isInWatchlist = isMovieInWatchlist(movie.id);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        if (isInWatchlist) {
            removeMovie(movie.id);
        } else {
            addMovie(movie);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`absolute top-2 right-2 z-10 p-1.5 rounded-full text-white transition-colors duration-200 ${
                isInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-black/60 hover:bg-black/80'
            }`}
            aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
            {isInWatchlist ? (
                // Minus Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
                </svg>
            ) : (
                // Plus Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            )}
        </button>
    );
};

export const MovieCard = ({ movie }: { movie: Movie }) => (
    <div className="flex-shrink-0 w-40 md:w-48 transform transition-transform duration-300 hover:scale-105 group">
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col h-full relative">
            <WatchlistButton movie={movie} />
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