package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"net/url"

	"github.com/gin-gonic/gin"
)

// --- Structs for TMDB Responses ---
type TMDBMovieDetails struct {
	ID            int      `json:"id"`
	IMDB_ID       string   `json:"imdb_id"`
	Title         string   `json:"title"`
	Overview      string   `json:"overview"`
	PosterPath    string   `json:"poster_path"`
	ReleaseDate   string   `json:"release_date"`
	VoteAverage   float64  `json:"vote_average"`
	Genres        []Genre  `json:"genres"`
	Tagline       string   `json:"tagline"`
	Runtime       int      `json:"runtime"`
}

type Genre struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

// --- Structs for OMDB Responses ---
type OMDBRating struct {
	Source string `json:"Source"`
	Value  string `json:"Value"`
}

type OMDBDetails struct {
	Rated      string       `json:"Rated"`
	Awards     string       `json:"Awards"`
	Ratings    []OMDBRating `json:"Ratings"`
	Plot       string       `json:"Plot"`
}

// --- Structs for TMDB Credits Response ---
type CastMember struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Character   string `json:"character"`
	ProfilePath string `json:"profile_path"`
}

// --- Combined Struct for Final API Response ---
type CombinedMovieDetails struct {
	TMDBDetails TMDBMovieDetails `json:"tmdb"`
	OMDBDetails OMDBDetails      `json:"omdb"`
	Cast        []CastMember     `json:"cast"`
}

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

// SearchMovies fetches movies from the TMDB API based on a search query.
func SearchMovies(c *gin.Context) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		log.Println("TMDB_API_KEY is not set in the environment variables.")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API key is not configured on the server."})
		return
	}

	query := c.Query("q")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Search query is required",
			"results": []interface{}{},
			"total_results": 0,
			"page": 1,
			"total_pages": 0,
		})
		return
	}

	url := "https://api.themoviedb.org/3/search/movie?query=" + url.QueryEscape(query) + "&include_adult=false&language=en-US&page=1"

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

	var searchResponse struct {
		Page         int           `json:"page"`
		Results      []interface{} `json:"results"`
		TotalPages   int          `json:"total_pages"`
		TotalResults int          `json:"total_results"`
	}

	if err := json.NewDecoder(res.Body).Decode(&searchResponse); err != nil {
		log.Printf("Failed to parse TMDB response: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response from external service."})
		return
	}

	// If no results found, return a custom response
	if searchResponse.TotalResults == 0 {
		c.JSON(http.StatusOK, gin.H{
			"results": []interface{}{},
			"total_results": 0,
			"page": 1,
			"total_pages": 0,
			"message": "No movies found matching your search.",
		})
		return
	}

	// Return the successful response
	c.JSON(http.StatusOK, searchResponse)
}

// GetMovieList fetches a list of movies (e.g., popular, top_rated) from TMDB.
func GetMovieList(c *gin.Context) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	if tmdbAPIKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API key is not configured on the server."})
		return
	}

	category := c.Param("category")
	page := c.DefaultQuery("page", "1")

	// Validate category to prevent arbitrary calls to TMDB
	validCategories := map[string]bool{
		"popular":      true,
		"top_rated":    true,
		"upcoming":     true,
		"now_playing":  true,
	}
	if !validCategories[category] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid movie category specified."})
		return
	}

	url := "https://api.themoviedb.org/3/movie/" + category + "?language=en-US&page=" + page

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create request to external service."})
		return
	}

	req.Header.Add("accept", "application/json")
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)

	res, err := http.DefaultClient.Do(req)
	if err != nil || res.StatusCode != http.StatusOK {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Failed to fetch data from external service."})
		return
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response from external service."})
		return
	}

	c.Data(res.StatusCode, res.Header.Get("Content-Type"), body)
}

// GetMovieDetails fetches combined details for a single movie from TMDB and OMDB.
func GetMovieDetails(c *gin.Context) {
	tmdbAPIKey := os.Getenv("TMDB_API_KEY")
	omdbAPIKey := os.Getenv("OMDB_API_KEY")
	if tmdbAPIKey == "" || omdbAPIKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "API keys are not configured on the server."})
		return
	}

	movieID := c.Param("id")
	
	// Step 1: Fetch details from TMDB
	tmdbURL := "https://api.themoviedb.org/3/movie/" + movieID
	req, _ := http.NewRequest("GET", tmdbURL, nil)
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)
	req.Header.Add("accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil || res.StatusCode != http.StatusOK {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Failed to fetch data from TMDB."})
		return
	}
	defer res.Body.Close()

	var tmdbDetails TMDBMovieDetails
	if err := json.NewDecoder(res.Body).Decode(&tmdbDetails); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse TMDB response."})
		return
	}

	// Step 2: Fetch credits from TMDB
	var cast []CastMember
	creditsURL := "https://api.themoviedb.org/3/movie/" + movieID + "/credits"
	req, _ = http.NewRequest("GET", creditsURL, nil)
	req.Header.Add("Authorization", "Bearer "+tmdbAPIKey)
	req.Header.Add("accept", "application/json")

	res, err = http.DefaultClient.Do(req)
	if err == nil && res.StatusCode == http.StatusOK {
		var creditsResponse struct {
			Cast []CastMember `json:"cast"`
		}
		if err := json.NewDecoder(res.Body).Decode(&creditsResponse); err == nil {
			cast = creditsResponse.Cast
		} else {
			log.Printf("Could not parse TMDB credits response: %v", err)
		}
	} else {
		log.Printf("Could not fetch TMDB credits: %v", err)
	}
	defer res.Body.Close()

	// Step 3: Fetch details from OMDB using IMDb ID from TMDB response
	if tmdbDetails.IMDB_ID == "" {
		// If no IMDb ID, we can't query OMDB, so just return TMDB details + Cast
		c.JSON(http.StatusOK, CombinedMovieDetails{TMDBDetails: tmdbDetails, Cast: cast})
		return
	}

	omdbURL := "http://www.omdbapi.com/?i=" + tmdbDetails.IMDB_ID + "&apikey=" + omdbAPIKey
	res, err = http.Get(omdbURL)
	if err != nil || res.StatusCode != http.StatusOK {
		// Non-critical error, so we can still return the TMDB data
		log.Printf("Could not fetch from OMDB: %v", err)
		c.JSON(http.StatusOK, CombinedMovieDetails{TMDBDetails: tmdbDetails, Cast: cast})
		return
	}
	defer res.Body.Close()

	var omdbDetails OMDBDetails
	if err := json.NewDecoder(res.Body).Decode(&omdbDetails); err != nil {
		log.Printf("Could not parse OMDB response: %v", err)
		// Again, return TMDB data + cast as a fallback
		c.JSON(http.StatusOK, CombinedMovieDetails{TMDBDetails: tmdbDetails, Cast: cast})
		return
	}

	// Step 4: Combine and return
	combinedDetails := CombinedMovieDetails{
		TMDBDetails: tmdbDetails,
		OMDBDetails: omdbDetails,
		Cast:        cast,
	}

	c.JSON(http.StatusOK, combinedDetails)
} 