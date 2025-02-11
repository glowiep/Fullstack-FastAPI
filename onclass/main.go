package main

import (
	"log"
	"onclass/database"
	"onclass/routes"

	_ "onclass/docs" // Import the generated Swagger docs

	swaggerFiles "github.com/swaggo/files"     // Swagger UI files
	ginSwagger "github.com/swaggo/gin-swagger" // Swagger middleware for Gin
)

// @title OnClass API
// @version 1.0
// @description API for managing school classes and students
// @host localhost:8080
// @BasePath /api/v1
func main() {
	// Initialize the database
	database.ConnectDB()

	// Set up routes
	router := routes.SetupRouter()

	// Serve Swagger UI at /swagger/index.html
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Start the server
	log.Println("Server is running on http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
