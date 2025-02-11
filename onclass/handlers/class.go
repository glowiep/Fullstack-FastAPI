package handlers

import (
	"log"
	"net/http"
	"onclass/database"
	"onclass/models"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateClass allows a teacher to create a new class
// @Summary Create a new class
// @Description Allows a teacher to create a new class with a name and teacher ID
// @Tags classes
// @Accept json
// @Produce json
// @Param class body models.Class true "Class data"
// @Success 201 {object} models.CreateClassResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /classes [post]
func CreateClass(c *gin.Context) {
	var newClass models.Class

	if err := c.ShouldBindJSON(&newClass); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	newClass.CreatedAt = time.Now()

	if err := database.DB.Create(&newClass).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Failed to create class"})
		return
	}

	c.JSON(http.StatusCreated, models.CreateClassResponse{
		Message: "Class created",
		Class:   newClass,
	})
}

// GetClass retrieves a class by ID
// @Summary Get class details
// @Description Retrieves class details by ID
// @Tags classes
// @Accept json
// @Produce json
// @Param id path int true "Class ID"
// @Success 200 {object} models.Class
// @Failure 404 {object} models.ErrorResponse
// @Router /classes/{id} [get]
func GetClass(c *gin.Context) {
	var class models.Class
	id := c.Param("id")

	if err := database.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}

	c.JSON(http.StatusOK, class)
}

// UpdateClass modifies class details
// @Summary Update a class
// @Description Updates class name or teacher ID
// @Tags classes
// @Accept json
// @Produce json
// @Param id path int true "Class ID"
// @Param class body models.Class true "Updated class data"
// @Success 200 {object} models.CreateClassResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Router /classes/{id} [put]
func UpdateClass(c *gin.Context) {
	var class models.Class
	id := c.Param("id")

	if err := database.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}

	if err := c.ShouldBindJSON(&class); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}

	database.DB.Save(&class)

	c.JSON(http.StatusOK, models.CreateClassResponse{
		Message: "Class updated",
		Class:   class,
	})
}

// / DeleteClass removes a class by ID
// @Summary Delete a class
// @Description Deletes a class by ID
// @Tags classes
// @Accept json
// @Produce json
// @Param id path int true "Class ID"
// @Success 200 {object} models.DeleteClassResponse
// @Failure 404 {object} models.ErrorResponse
// @Router /classes/{id} [delete]
func DeleteClass(c *gin.Context) {
	var class models.Class
	id := c.Param("id")

	// Convert ID to integer
	if err := database.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}

	// Delete the class
	database.DB.Delete(&class)
	log.Printf("Class with ID %d deleted successfully", class.ID)

	// Return confirmation message
	c.JSON(http.StatusOK, models.DeleteClassResponse{
		Message: "Class successfully deleted",
		ClassID: class.ID,
	})
}
