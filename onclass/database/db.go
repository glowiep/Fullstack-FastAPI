package database

import (
	"log"
	"onclass/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB initializes the database connection
func ConnectDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("school.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the Class model
	DB.AutoMigrate(&models.Class{})
}
