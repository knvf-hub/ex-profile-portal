package service

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"strings"
	"time"

	"ex-profile/backend/internal/model"
	"ex-profile/backend/internal/repository"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	users       *repository.UserRepository
	sessions    *repository.SessionRepository
	skills      *repository.SkillRepository
	sessionDays int
}

func NewAuthService(
	users *repository.UserRepository,
	sessions *repository.SessionRepository,
	skills *repository.SkillRepository,
	sessionDays int,
) *AuthService {
	return &AuthService{users: users, sessions: sessions, skills: skills, sessionDays: sessionDays}
}

type RegisterInput struct {
	FirstName string   `json:"first_name"`
	LastName  string   `json:"last_name"`
	Email     string   `json:"email"`
	Password  string   `json:"password"`
	Phone     string   `json:"phone"`
	Address   string   `json:"address"`
	Skills    []string `json:"skills"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResult struct {
	User      *model.User `json:"user"`
	Token     string      `json:"-"`
	ExpiresAt time.Time   `json:"expires_at"`
}

func (s *AuthService) Register(input RegisterInput) (*AuthResult, error) {
	input.FirstName = strings.TrimSpace(input.FirstName)
	input.LastName = strings.TrimSpace(input.LastName)
	input.Email = strings.ToLower(strings.TrimSpace(input.Email))
	input.Phone = strings.TrimSpace(input.Phone)
	input.Address = strings.TrimSpace(input.Address)

	if input.FirstName == "" || input.LastName == "" || input.Email == "" || input.Password == "" || input.Phone == "" || input.Address == "" {
		return nil, errors.New("first_name, last_name, email, password, phone, and address are required")
	}

	existing, err := s.users.FindByEmail(input.Email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	normalizedSkills, err := s.normalizeSkills(input.Skills)
	if err != nil {
		return nil, err
	}

	skills, err := s.skills.FindOrCreateMany(normalizedSkills)
	if err != nil {
		return nil, err
	}

	user := &model.User{
		Email:        input.Email,
		PasswordHash: string(hash),
		Profile: model.Profile{
			FirstName: input.FirstName,
			LastName:  input.LastName,
			Phone:     input.Phone,
			Email:     input.Email,
			Address:   input.Address,
			Skills:    skills,
		},
	}

	if err := s.users.Create(user); err != nil {
		return nil, err
	}

	return s.createSession(user)
}

func (s *AuthService) Login(input LoginInput) (*AuthResult, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))
	user, err := s.users.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("invalid email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return nil, errors.New("invalid email or password")
	}

	return s.createSession(user)
}

func (s *AuthService) Logout(token string) error {
	if token == "" {
		return nil
	}
	return s.sessions.DeleteByTokenHash(HashToken(token))
}

func (s *AuthService) CurrentUser(token string) (*model.User, error) {
	if token == "" {
		return nil, nil
	}

	session, err := s.sessions.FindValidByTokenHash(HashToken(token), time.Now())
	if err != nil {
		return nil, err
	}
	if session == nil {
		return nil, nil
	}

	return s.users.FindByID(session.UserID)
}

func (s *AuthService) createSession(user *model.User) (*AuthResult, error) {
	token := uuid.NewString()
	expiresAt := time.Now().AddDate(0, 0, s.sessionDays)

	if err := s.sessions.Create(&model.Session{
		UserID:    user.ID,
		TokenHash: HashToken(token),
		ExpiresAt: expiresAt,
	}); err != nil {
		return nil, err
	}

	fresh, err := s.users.FindByID(user.ID)
	if err != nil {
		return nil, err
	}

	return &AuthResult{User: fresh, Token: token, ExpiresAt: expiresAt}, nil
}

func HashToken(token string) string {
	sum := sha256.Sum256([]byte(token))
	return hex.EncodeToString(sum[:])
}

func (s *AuthService) normalizeSkills(skills []string) ([]string, error) {
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
	return normalized, nil
}
