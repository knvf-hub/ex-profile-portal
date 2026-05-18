package model

import "time"

type User struct {
	ID           uint      `json:"id" gorm:"primaryKey"`
	Email        string    `json:"email" gorm:"uniqueIndex;not null"`
	PasswordHash string    `json:"-" gorm:"not null"`
	Profile      Profile   `json:"profile" gorm:"constraint:OnDelete:CASCADE;"`
	Sessions     []Session `json:"-" gorm:"constraint:OnDelete:CASCADE;"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}
