package models

import (
	"time"
)

// Class represents a school class (grade 6 math)
type Class struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" example:"Math 101"`
	TeacherID uint      `json:"teacher_id" example:"1"`
	CreatedAt time.Time `json:"created_at" example:"2025-02-11T12:00:00Z"`
}

type DeleteClassResponse struct {
	Message string `json:"message"`
	ClassID uint   `json:"class_id"`
}
