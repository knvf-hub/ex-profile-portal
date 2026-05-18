package model

import "time"

type Profile struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id" gorm:"uniqueIndex;not null"`
	FirstName string    `json:"first_name" gorm:"not null"`
	LastName  string    `json:"last_name" gorm:"not null"`
	Phone     string    `json:"phone" gorm:"not null"`
	Email     string    `json:"email" gorm:"not null"`
	Address   string    `json:"address" gorm:"not null"`
	ImageURL  string    `json:"image_url"`
	Skills    []Skill   `json:"skills" gorm:"many2many:employee_skills;joinForeignKey:ProfileID;joinReferences:SkillID;constraint:OnDelete:CASCADE;"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
