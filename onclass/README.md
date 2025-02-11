# OnClass API

## Overview
OnClass is a RESTful API built using **Golang** and **Gin** to help teachers manage their classes, students, and observations.

## Features
- **Create, Read, Update, and Delete (CRUD) classes**
- **Swagger UI for API testing**
- WIP - **Add students to a class**
- WIP - **Track student behaviors**
- WIP - **Share notes with substitute teachers**

## Tech Stack
- **Golang** (with Gin framework)
- **GORM** (for database interactions)
- **SQLite** (configurable database)
- **Swagger** (API documentation)

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [**Go 1.19+**](https://go.dev/doc/install)

### Installation

1. **Install dependencies**:
   ```sh
   go mod tidy
   ```

2. **Run the application**:
   ```sh
   go run main.go
   ```

3. **Access Swagger UI**:
   Open `http://localhost:8080/swagger/index.html` in your browser.

---

## API Usage

### Create a Class
```sh
curl -X POST "http://localhost:8080/api/v1/classes" \
     -H "Content-Type: application/json" \
     -d '{
          "name": "Math 101",
          "teacher_id": 1,
          "start_time": "2025-02-12T08:00:00Z",
          "end_time": "2025-02-12T09:30:00Z"
        }'
```

### Get All Classes
```sh
curl -X GET "http://localhost:8080/api/v1/classes"
```

### Update a Class
```sh
curl -X PUT "http://localhost:8080/api/v1/classes/1" \
     -H "Content-Type: application/json" \
     -d '{"name": "Updated Math 101"}'
```

### Delete a Class
```sh
curl -X DELETE "http://localhost:8080/api/v1/classes/1"
```

---

## Contributing to codebase

**Example: Adding a New Endpoint**

Let's say you want to add an endpoint to retrieve a single class by ID.

### 1. Modify `handlers/class.go`:
```go
// GetClassByID retrieves a class by ID
// @Summary Get a class
// @Description Retrieve a specific class by ID
// @Tags classes
// @Accept json
// @Produce json
// @Param id path int true "Class ID"
// @Success 200 {object} models.Class
// @Failure 404 {object} models.ErrorResponse
// @Router /classes/{id} [get]
func GetClassByID(c *gin.Context) {
    var class models.Class
    id := c.Param("id")

    if err := database.DB.First(&class, id).Error; err != nil {
        c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
        return
    }

    c.JSON(http.StatusOK, class)
}
```

### 2. Add the Route in `routes/routes.go`:
```go
router.GET("/api/v1/classes/:id", handlers.GetClassByID)
```

### 3. Rebuild API Swagger and restart server:
```sh
swag init
go run main.go
```

### 4. Try new endpoint

```sh
curl -X GET "http://localhost:8080/api/v1/classes/1"
```

This should return:
```json
{
    "id": 1,
    "name": "Math 101",
    "teacher_id": 1,
    "start_time": "2025-02-12T08:00:00Z",
    "end_time": "2025-02-12T09:30:00Z"
}
```

