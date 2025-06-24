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