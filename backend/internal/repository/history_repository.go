package repository

import (
	"time"

	"ex-profile/backend/internal/model"

	"gorm.io/gorm"
)

type HistoryRepository struct {
	db *gorm.DB
}

func NewHistoryRepository(db *gorm.DB) *HistoryRepository {
	return &HistoryRepository{db: db}
}

func (r *HistoryRepository) Create(history *model.ChangeHistory) error {
	return r.db.Create(history).Error
}

func (r *HistoryRepository) ListSince(profileID uint, since time.Time) ([]model.ChangeHistory, error) {
	var histories []model.ChangeHistory
	err := r.db.Where("profile_id = ? AND created_at >= ?", profileID, since).
		Order("created_at DESC").
		Find(&histories).Error
	return histories, err
}
