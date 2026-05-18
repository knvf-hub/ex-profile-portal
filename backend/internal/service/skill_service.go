package service

import (
	"ex-profile/backend/internal/model"
	"ex-profile/backend/internal/repository"
)

type SkillService struct {
	skills *repository.SkillRepository
}

func NewSkillService(skills *repository.SkillRepository) *SkillService {
	return &SkillService{skills: skills}
}

func (s *SkillService) List() ([]model.Skill, error) {
	return s.skills.List()
}

func (s *SkillService) Create(name string) (*model.Skill, error) {
	return s.skills.FindOrCreateByName(name)
}
