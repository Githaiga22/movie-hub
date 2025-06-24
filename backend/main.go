package main

import (
	"log"
	"net/http"
	"os"

	"github.com/allkamau/movie-hub-backend/handlers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables.")
	}

	r := gin.Default()

	// API routes
	api := r.Group("/api")
	{
		api.GET("/trending", handlers.GetTrendingMovies)
		api.GET("/search", handlers.SearchMovies)
		api.GET("/movie/:id", handlers.GetMovieDetails)
		api.GET("/movies/:category", handlers.GetMovieList)
		api.GET("/genres", handlers.GetGenreList)
		api.GET("/discover/genre/:id", handlers.DiscoverMoviesByGenre)
	}

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Backend running on port %s", port)
	r.Run(":" + port)
}
