package repository

import (
	"errors"
	"strings"

	"ex-profile/backend/internal/model"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SkillRepository struct {
	db *gorm.DB
}

func NewSkillRepository(db *gorm.DB) *SkillRepository {
	return &SkillRepository{db: db}
}

func (r *SkillRepository) Seed(names []string) error {
	for _, name := range names {
		if _, err := r.FindOrCreateByName(name); err != nil {
			return err
		}
	}
	return nil
}

func (r *SkillRepository) List() ([]model.Skill, error) {
	var skills []model.Skill
	err := r.db.Order("name ASC").Find(&skills).Error
	return skills, err
}

func (r *SkillRepository) FindOrCreateByName(name string) (*model.Skill, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return nil, errors.New("skill name is required")
	}

	skill := model.Skill{Name: name}
	err := r.db.Clauses(clause.OnConflict{DoNothing: true}).Create(&skill).Error
	if err != nil {
		return nil, err
	}

	var found model.Skill
	err = r.db.Where("lower(name) = lower(?)", name).First(&found).Error
	if err != nil {
		return nil, err
	}
	return &found, nil
}

func (r *SkillRepository) FindOrCreateMany(names []string) ([]model.Skill, error) {
	seen := map[string]struct{}{}
	skills := make([]model.Skill, 0, len(names))

	for _, name := range names {
		name = strings.TrimSpace(name)
		if name == "" {
			continue
		}

		key := strings.ToLower(name)
		if _, ok := seen[key]; ok {
			continue
		}
		seen[key] = struct{}{}

		skill, err := r.FindOrCreateByName(name)
		if err != nil {
			return nil, err
		}
		skills = append(skills, *skill)
	}

	return skills, nil
}
