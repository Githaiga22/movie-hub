'use client';

import { getMovieDetails, CombinedMovieDetails } from '@/services/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const DetailSkeleton = () => (
  <div className="min-h-screen bg-black text-white p-8 animate-pulse">
    <div className="max-w-4xl mx-auto">
      <div className="w-24 h-8 bg-gray-800 rounded-lg mb-8"></div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 h-96 bg-gray-800 rounded-lg"></div>
        <div className="w-full md:w-2/3">
          <div className="h-10 bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-800 rounded w-1/2 mb-6"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6 mb-8"></div>
          <div className="h-8 bg-gray-800 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
);


export default function MovieDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [movie, setMovie] = useState<CombinedMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (error) return <div className="min-h-screen bg-black text-white text-center py-20"><p className="text-red-500">{error}</p></div>;
  if (!movie) return null;

  const { tmdb, omdb, cast } = movie;

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%), url(https://image.tmdb.org/t/p/original${tmdb.poster_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-5xl mx-auto p-8">
        <Link href="/" className="text-red-500 hover:text-red-400 transition-colors mb-8 inline-block">
          &larr; Back to Home
        </Link>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={`https://image.tmdb.org/t/p/w500${tmdb.poster_path}`}
              alt={tmdb.title}
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{tmdb.title}</h1>
            <p className="text-gray-400 italic mb-4">{tmdb.tagline}</p>
            <div className="flex items-center gap-4 mb-4 text-gray-300">
              <span>{tmdb.release_date.substring(0, 4)}</span>
              <span>•</span>
              <span>{omdb.Rated || 'Not Rated'}</span>
              <span>•</span>
              <span>{tmdb.runtime} min</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {tmdb.genres.map(g => <span key={g.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">{g.name}</span>)}
            </div>

            <h2 className="text-2xl font-bold mb-2">Plot</h2>
            <p className="text-gray-300 mb-6">{omdb.Plot || tmdb.overview}</p>
            
            <h3 className="text-xl font-bold mb-3">Ratings</h3>
            <div className="flex gap-4 items-start mb-6">
              {omdb.Ratings?.map(r => (
                <div key={r.Source} className="bg-gray-800/50 p-3 rounded-lg text-center">
                  <p className="font-bold text-lg">{r.Value}</p>
                  <p className="text-xs text-gray-400">{r.Source}</p>
                </div>
              ))}
            </div>

            {omdb.Awards && (
              <div>
                <h3 className="text-xl font-bold mb-2">Awards</h3>
                <p className="text-gray-400">{omdb.Awards}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {cast && cast.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Top Cast</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {cast.slice(0, 20).map((actor, index) => (
                <div key={`${actor.id}-${index}`} className="flex-shrink-0 w-32 text-center">
                  <div className="relative w-full rounded-full overflow-hidden" style={{ paddingTop: '100%' }}>
                    {actor.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <p className="font-bold mt-2 text-sm">{actor.name}</p>
                  <p className="text-xs text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 