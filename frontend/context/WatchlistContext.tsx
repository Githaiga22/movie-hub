'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/services/api';

interface WatchlistContextType {
  watchlist: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  isMovieInWatchlist: (movieId: number) => boolean;
  watched: number[]; // Array of movie IDs
  markAsWatched: (movieId: number) => void;
  unmarkAsWatched: (movieId: number) => void;
  isMovieWatched: (movieId: number) => boolean;
  toggleWatched: (movieId: number) => void;
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
  const [watched, setWatched] = useState<number[]>([]);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem('watchlist');
      if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));
      
      const storedWatched = localStorage.getItem('watched');
      if (storedWatched) setWatched(JSON.parse(storedWatched));
    } catch (error) {
      console.error("Could not load data from localStorage", error);
    }
  }, []);

  const saveWatchlist = (newWatchlist: Movie[]) => {
    setWatchlist(newWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  };

  const saveWatched = (newWatched: number[]) => {
    setWatched(newWatched);
    localStorage.setItem('watched', JSON.stringify(newWatched));
  };

  const addMovie = (movie: Movie) => {
    if (!watchlist.some(m => m.id === movie.id)) {
      saveWatchlist([...watchlist, movie]);
    }
  };

  const removeMovie = (movieId: number) => {
    saveWatchlist(watchlist.filter(movie => movie.id !== movieId));
    // Also remove from watched list if it's there
    unmarkAsWatched(movieId);
  };

  const isMovieInWatchlist = (movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const markAsWatched = (movieId: number) => {
    if (!watched.includes(movieId)) {
      saveWatched([...watched, movieId]);
    }
  };

  const unmarkAsWatched = (movieId: number) => {
    saveWatched(watched.filter(id => id !== movieId));
  };

  const isMovieWatched = (movieId: number) => {
    return watched.includes(movieId);
  };

  const toggleWatched = (movieId: number) => {
    if (isMovieWatched(movieId)) {
      unmarkAsWatched(movieId);
    } else {
      markAsWatched(movieId);
      // Also add to watchlist if it's not already there
      if (!isMovieInWatchlist(movieId)) {
          console.error("This should not happen: Toggling 'watched' on a movie not in the watchlist.");
          // In a real app, you might want to fetch the movie details and add it.
          // For now, we'll rely on the UI flow preventing this.
      }
    }
  };

  const value = {
    watchlist,
    addMovie,
    removeMovie,
    isMovieInWatchlist,
    watched,
    markAsWatched,
    unmarkAsWatched,
    isMovieWatched,
    toggleWatched,
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}; 