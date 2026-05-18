package model

import "time"

type Skill struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"uniqueIndex;not null"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type EmployeeSkill struct {
	ProfileID uint      `json:"profile_id" gorm:"primaryKey;column:profile_id"`
	SkillID   uint      `json:"skill_id" gorm:"primaryKey;column:skill_id"`
	CreatedAt time.Time `json:"created_at"`
}

func (EmployeeSkill) TableName() string {
	return "employee_skills"
}
