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