package handlers

import (
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// GetTrendingMovies fetches trending movies from the TMDB API and proxies the response.
func GetTrendingMovies(c *gin.Context) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		log.Println("TMDB_API_KEY is not set in the environment variables.")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API key is not configured on the server."})
		return
	}

	url := "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Printf("Failed to create request to TMDB: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create request to external service."})
		return
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("Failed to fetch data from TMDB: %v", err)
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Failed to fetch data from external service."})
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Printf("Failed to read response body from TMDB: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response from external service."})
		return
	}

	// Proxy the status, content type, and body directly from the TMDB response.
	c.Data(res.StatusCode, res.Header.Get("Content-Type"), body)
} 