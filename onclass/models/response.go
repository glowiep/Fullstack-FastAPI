package models

// CreateClassResponse represents the response after creating a class
type CreateClassResponse struct {
	Message string `json:"message"`
	Class   Class  `json:"class"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Error string `json:"error"`
}
