package model

import "time"

type ChangeHistory struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	ProfileID uint      `json:"profile_id" gorm:"index;not null"`
	Field     string    `json:"field" gorm:"not null"`
	OldValue  string    `json:"old_value"`
	NewValue  string    `json:"new_value"`
	CreatedAt time.Time `json:"created_at"`
}
