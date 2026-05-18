package repository

import (
	"errors"

	"ex-profile/backend/internal/model"

	"gorm.io/gorm"
)

type ProfileRepository struct {
	db *gorm.DB
}

func NewProfileRepository(db *gorm.DB) *ProfileRepository {
	return &ProfileRepository{db: db}
}

func (r *ProfileRepository) FindByUserID(userID uint) (*model.Profile, error) {
	var profile model.Profile
	err := r.db.Preload("Skills").Where("user_id = ?", userID).First(&profile).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &profile, nil
}

func (r *ProfileRepository) UpdateContact(profile *model.Profile) error {
	return r.db.Model(profile).Updates(map[string]any{
		"phone":   profile.Phone,
		"email":   profile.Email,
		"address": profile.Address,
	}).Error
}

func (r *ProfileRepository) ReplaceSkillModels(profileID uint, skills []model.Skill) error {
	var profile model.Profile
	if err := r.db.First(&profile, profileID).Error; err != nil {
		return err
	}
	return r.db.Model(&profile).Association("Skills").Replace(skills)
}

func (r *ProfileRepository) UpdatePhoto(profileID uint, imageURL string) error {
	return r.db.Model(&model.Profile{}).Where("id = ?", profileID).Update("image_url", imageURL).Error
}
