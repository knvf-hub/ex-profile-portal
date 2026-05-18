package repository

import (
	"errors"
	"time"

	"ex-profile/backend/internal/model"

	"gorm.io/gorm"
)

type SessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

func (r *SessionRepository) Create(session *model.Session) error {
	return r.db.Create(session).Error
}

func (r *SessionRepository) FindValidByTokenHash(tokenHash string, now time.Time) (*model.Session, error) {
	var session model.Session
	err := r.db.Where("token_hash = ? AND expires_at > ?", tokenHash, now).First(&session).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (r *SessionRepository) DeleteByTokenHash(tokenHash string) error {
	return r.db.Where("token_hash = ?", tokenHash).Delete(&model.Session{}).Error
}

func (r *SessionRepository) DeleteExpired(now time.Time) error {
	return r.db.Where("expires_at <= ?", now).Delete(&model.Session{}).Error
}
