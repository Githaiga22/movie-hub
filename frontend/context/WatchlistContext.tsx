'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/services/api';

interface WatchlistContextType {
  watchlist: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  isMovieInWatchlist: (movieId: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider = ({ children }: WatchlistProviderProps) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
        console.error("Could not load watchlist from localStorage", error);
        // If localStorage is corrupt, start fresh
        localStorage.removeItem('watchlist');
    }
  }, []);

  const saveWatchlist = (newWatchlist: Movie[]) => {
    try {
        setWatchlist(newWatchlist);
        localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
    } catch (error) {
        console.error("Could not save watchlist to localStorage", error);
    }
  };

  const addMovie = (movie: Movie) => {
    const newWatchlist = [...watchlist, movie];
    saveWatchlist(newWatchlist);
  };

  const removeMovie = (movieId: number) => {
    const newWatchlist = watchlist.filter(movie => movie.id !== movieId);
    saveWatchlist(newWatchlist);
  };

  const isMovieInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const value = {
    watchlist,
    addMovie,
    removeMovie,
    isMovieInWatchlist,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}; 