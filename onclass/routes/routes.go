package routes

import (
	"onclass/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	classRoutes := router.Group("/api/v1/classes")
	{
		classRoutes.POST("/", handlers.CreateClass)
		classRoutes.GET("/:id", handlers.GetClass)
		classRoutes.PUT("/:id", handlers.UpdateClass)
		classRoutes.DELETE("/:id", handlers.DeleteClass)
	}

	return router
}
