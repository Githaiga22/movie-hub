import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxies to the Go backend
});

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export interface PaginatedMovies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// --- From tmdb.go ---
interface TMDBMovieDetails {
  id: number;
  imdb_id: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: { id: number; name: string }[];
  tagline: string;
  runtime: number;
}

interface OMDBRating {
  Source: string;
  Value: string;
}

interface OMDBDetails {
  Rated: string;
  Awards: string;
  Ratings: OMDBRating[];
  Plot: string;
}

export interface CombinedMovieDetails {
  tmdb: TMDBMovieDetails;
  omdb: OMDBDetails;
  cast: {
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }[];
}

export const getTrendingMovies = async (): Promise<PaginatedMovies> => {
  try {
    const response = await api.get<PaginatedMovies>('/trending');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch trending movies:', error);
    // In a real app, you'd want to handle this error more gracefully
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<PaginatedMovies> => {
  if (!query) {
    return { page: 1, results: [], total_pages: 1, total_results: 0 };
  }
  try {
    const response = await api.get<PaginatedMovies>('/search', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to search for movies with query "${query}":`, error);
    throw error;
  }
};

export const getMovieDetails = async (id: string): Promise<CombinedMovieDetails> => {
  try {
    const response = await api.get<CombinedMovieDetails>(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch details for movie ${id}:`, error);
    throw error;
  }
};

export const getMovieList = async (category: string, page: number = 1): Promise<PaginatedMovies> => {
  try {
    const response = await api.get<PaginatedMovies>(`/movies/${category}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${category} movies:`, error);
    throw error;
  }
}; 