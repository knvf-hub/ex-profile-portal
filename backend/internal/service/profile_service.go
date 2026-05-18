package service

import (
	"errors"
	"slices"
	"strings"
	"time"

	"ex-profile/backend/internal/model"
	"ex-profile/backend/internal/repository"
)

type ProfileService struct {
	profiles    *repository.ProfileRepository
	histories   *repository.HistoryRepository
	skills      *repository.SkillRepository
	historyDays int
}

func NewProfileService(
	profiles *repository.ProfileRepository,
	histories *repository.HistoryRepository,
	skills *repository.SkillRepository,
	historyDays int,
) *ProfileService {
	return &ProfileService{
		profiles:    profiles,
		histories:   histories,
		skills:      skills,
		historyDays: historyDays,
	}
}

type UpdateContactInput struct {
	Phone   string `json:"phone"`
	Email   string `json:"email"`
	Address string `json:"address"`
}

func (s *ProfileService) GetByUserID(userID uint) (*model.Profile, error) {
	profile, err := s.profiles.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if profile == nil {
		return nil, errors.New("profile not found")
	}
	return profile, nil
}

func (s *ProfileService) UpdateContact(userID uint, input UpdateContactInput) (*model.Profile, error) {
	profile, err := s.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	input.Phone = strings.TrimSpace(input.Phone)
	input.Email = strings.TrimSpace(input.Email)
	input.Address = strings.TrimSpace(input.Address)
	if input.Phone == "" || input.Email == "" || input.Address == "" {
		return nil, errors.New("phone, email, and address are required")
	}

	oldPhone := profile.Phone
	oldEmail := profile.Email
	oldAddress := profile.Address
	profile.Phone = input.Phone
	profile.Email = input.Email
	profile.Address = input.Address

	if err := s.profiles.UpdateContact(profile); err != nil {
		return nil, err
	}

	s.recordIfChanged(profile.ID, "phone", oldPhone, profile.Phone)
	s.recordIfChanged(profile.ID, "email", oldEmail, profile.Email)
	s.recordIfChanged(profile.ID, "address", oldAddress, profile.Address)

	return s.GetByUserID(userID)
}

func (s *ProfileService) UpdateSkills(userID uint, skills []string) (*model.Profile, error) {
	profile, err := s.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	normalized, err := s.normalizeSkills(skills)
	if err != nil {
		return nil, err
	}
	modelSkills, err := s.skills.FindOrCreateMany(normalized)
	if err != nil {
		return nil, err
	}

	oldValue := joinSkillModels(profile.Skills)
	newValue := strings.Join(normalized, ",")
	if err := s.profiles.ReplaceSkillModels(profile.ID, modelSkills); err != nil {
		return nil, err
	}
	s.recordIfChanged(profile.ID, "skills", oldValue, newValue)

	return s.GetByUserID(userID)
}

func (s *ProfileService) UpdatePhoto(userID uint, imageURL string) (*model.Profile, error) {
	profile, err := s.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	oldValue := profile.ImageURL
	if err := s.profiles.UpdatePhoto(profile.ID, imageURL); err != nil {
		return nil, err
	}
	s.recordIfChanged(profile.ID, "image_url", oldValue, imageURL)

	return s.GetByUserID(userID)
}

func (s *ProfileService) History(userID uint) ([]model.ChangeHistory, error) {
	profile, err := s.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	since := time.Now().AddDate(0, 0, -s.historyDays)
	return s.histories.ListSince(profile.ID, since)
}

func (s *ProfileService) normalizeSkills(skills []string) ([]string, error) {
	seen := map[string]struct{}{}
	normalized := make([]string, 0, len(skills))

	for _, skill := range skills {
		item := strings.TrimSpace(skill)
		if item == "" {
			continue
		}

		key := strings.ToLower(item)
		if _, ok := seen[key]; ok {
			continue
		}

		seen[key] = struct{}{}
		normalized = append(normalized, item)
	}

	slices.Sort(normalized)
	return normalized, nil
}

func (s *ProfileService) recordIfChanged(profileID uint, field, oldValue, newValue string) {
	if oldValue == newValue {
		return
	}

	_ = s.histories.Create(&model.ChangeHistory{
		ProfileID: profileID,
		Field:     field,
		OldValue:  oldValue,
		NewValue:  newValue,
	})
}

func joinSkillModels(skills []model.Skill) string {
	names := make([]string, 0, len(skills))
	for _, skill := range skills {
		names = append(names, skill.Name)
	}
	slices.Sort(names)
	return strings.Join(names, ",")
}
