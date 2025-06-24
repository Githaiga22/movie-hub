#  Movie Hub

**Movie Hub** is a full-stack Movie and TV Show Discovery Web App built with **Go (Golang)** for the backend and **React with Next.js (App Router)** for the frontend. The app is designed to deliver a clean, modern, and responsive user experience inspired by platforms like **Netflix**, **Amazon Prime**, and **MovieBox**.

---

##  Project Goals

The goal of this project is to create an all-in-one entertainment discovery platform that allows users to:

- Search for movies and TV shows in real-time
- Browse trending content and genres
- View detailed movie/show information
- Manage a personal watchlist
- Get personalized recommendations
- Watch trailers and export lists
- Collaborate via Git and improve code quality through PR reviews

---

##  Core Features (MVP)

###  Search Functionality
- Real-time search for movies/TV shows
- Debounced input to minimize API load
- Paginated results

###  Detailed View Pages
- Title, plot, cast, release date
- Poster images and ratings (IMDB, Rotten Tomatoes, TMDB)

###  Watchlist Management
- Add/remove items from watchlist
- Mark items as watched
- Stored in `localStorage`

###  Trending Dashboard
- Discover currently popular content from TMDB

###  Genre & Category Browsing
- Filter movies/shows by genre or category

###  Recommendation Engine
- Suggest content based on user’s watch history/preferences

###  Dark/Light Theme Toggle

###  Trailer Integration
- Embed official trailers using YouTube API

###  Export Watchlist
- Export watchlist as **CSV** or **PDF**

###  Social Features (Bonus)
- Share your favorite titles with friends

---

##  API Integration

- **TMDB API** – Primary source for movies/TV shows, images, trending data
- **OMDB API** – Additional ratings, IMDb IDs, extended plot info
- **YouTube API** – Trailer video embedding

### API Implementation Goals:
- Store API keys securely in `.env.local`
- Handle API rate limits gracefully
- Add error handling and loading states
- Cache responses to boost performance
- Fallbacks for missing/incomplete data

---

##  Tech Stack

###  Frontend – TypeScript + Next.js
- App Router architecture with TypeScript
- Fully mobile-responsive (Netflix-style UI)
- Modular components with reusable hooks
- State management via `useContext` or Zustand (planned)

###  Backend – Go (Golang)
- REST API for handling all external data
- Organized with modular `handlers/` structure
- Uses `net/http`, `os`, and `joho/godotenv` for routing and env config
- Plans for middleware (logging, error handling, etc.)

---
