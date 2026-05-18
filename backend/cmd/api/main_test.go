package main

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"testing"

	"ex-profile/backend/internal/db"
	"ex-profile/backend/internal/handler"
	"ex-profile/backend/internal/middleware"
	"ex-profile/backend/internal/repository"
	"ex-profile/backend/internal/service"
	"ex-profile/backend/internal/storage"

	"github.com/gofiber/fiber/v2"
)

func TestAuthAndProfileFlow(t *testing.T) {
	database, err := db.Init(filepath.Join(t.TempDir(), "app.db"))
	if err != nil {
		t.Fatal(err)
	}

	skills := []string{"Go", "React", "Flutter", "CI/CD"}
	userRepo := repository.NewUserRepository(database)
	sessionRepo := repository.NewSessionRepository(database)
	profileRepo := repository.NewProfileRepository(database)
	historyRepo := repository.NewHistoryRepository(database)
	skillRepo := repository.NewSkillRepository(database)
	if err := skillRepo.Seed(skills); err != nil {
		t.Fatal(err)
	}
	authService := service.NewAuthService(userRepo, sessionRepo, skillRepo, 7)
	profileService := service.NewProfileService(profileRepo, historyRepo, skillRepo, 7)
	skillService := service.NewSkillService(skillRepo)
	authHandler := handler.NewAuthHandler(authService)
	profileHandler := handler.NewProfileHandler(profileService, storage.NewFileStorage(t.TempDir()))
	skillHandler := handler.NewSkillHandler(skillService)
	authMiddleware := middleware.Auth(authService)

	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			message := "internal server error"
			if fiberErr, ok := err.(*fiber.Error); ok {
				code = fiberErr.Code
				message = fiberErr.Message
			}
			return c.Status(code).JSON(fiber.Map{"error": message})
		},
	})
	api := app.Group("/api")
	api.Get("/config/skills", skillHandler.List)
	api.Post("/config/skills", authMiddleware, skillHandler.Create)
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/logout", authHandler.Logout)
	auth.Get("/me", authMiddleware, authHandler.Me)
	profile := api.Group("/profile", authMiddleware)
	profile.Get("/", profileHandler.GetProfile)
	profile.Get("", profileHandler.GetProfile)
	profile.Patch("/contact", profileHandler.UpdateContact)
	profile.Patch("/skills", profileHandler.UpdateSkills)
	profile.Patch("/photo", profileHandler.UpdatePhoto)
	profile.Get("/history", profileHandler.History)

	resp := requestJSON(t, app, http.MethodGet, "/api/profile", nil, nil)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected unauthorized profile access, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	registerBody := map[string]any{
		"first_name": "Pheerawat",
		"last_name":  "Frank",
		"email":      "frank@example.com",
		"password":   "secret123",
		"phone":      "0812345678",
		"address":    "Bangkok",
		"skills":     []string{"Go", "React"},
	}
	resp = requestJSON(t, app, http.MethodPost, "/api/auth/register", registerBody, nil)
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected register created, got %d", resp.StatusCode)
	}
	cookies := resp.Cookies()
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPost, "/api/auth/register", registerBody, nil)
	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("expected duplicate register to fail, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPost, "/api/auth/login", map[string]any{
		"email": "frank@example.com", "password": "wrong",
	}, nil)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected bad login unauthorized, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPost, "/api/auth/login", map[string]any{
		"email": "frank@example.com", "password": "secret123",
	}, nil)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected login ok, got %d", resp.StatusCode)
	}
	var loginBody struct {
		Token     string `json:"token"`
		ExpiresAt string `json:"expires_at"`
		User      any    `json:"user"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&loginBody); err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	if loginBody.Token == "" {
		t.Fatal("expected login response token")
	}
	if loginBody.ExpiresAt == "" {
		t.Fatal("expected login response expires_at")
	}
	if loginBody.User != nil {
		t.Fatal("login response must not include user/profile")
	}

	resp = requestJSON(t, app, http.MethodGet, "/api/profile", nil, cookies)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected profile ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPatch, "/api/profile/contact", map[string]any{
		"phone": "0899999999", "email": "contact@example.com", "address": "Pathumwan",
	}, cookies)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected contact update ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPatch, "/api/profile/skills", map[string]any{
		"skills": []string{"CI/CD", "Go", "Dotnet"},
	}, cookies)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected skills update ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPost, "/api/config/skills", map[string]any{
		"name": "Kubernetes",
	}, cookies)
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected skill create ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	var upload bytes.Buffer
	writer := multipart.NewWriter(&upload)
	part, err := writer.CreateFormFile("photo", "profile.png")
	if err != nil {
		t.Fatal(err)
	}
	if _, err := part.Write([]byte("fake-image")); err != nil {
		t.Fatal(err)
	}
	if err := writer.Close(); err != nil {
		t.Fatal(err)
	}
	req, err := http.NewRequest(http.MethodPatch, "/api/profile/photo", &upload)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}
	resp, err = app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected photo update ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodGet, "/api/profile/history", nil, cookies)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected history ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodPost, "/api/auth/logout", nil, cookies)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected logout ok, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp = requestJSON(t, app, http.MethodGet, "/api/auth/me", nil, cookies)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected old session unauthorized after logout, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}

func requestJSON(t *testing.T, app *fiber.App, method string, url string, body any, cookies []*http.Cookie) *http.Response {
	t.Helper()

	var payload bytes.Buffer
	if body != nil {
		if err := json.NewEncoder(&payload).Encode(body); err != nil {
			t.Fatal(err)
		}
	}

	req, err := http.NewRequest(method, url, &payload)
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	for _, cookie := range cookies {
		req.AddCookie(cookie)
	}

	resp, err := app.Test(req)
	if err != nil {
		t.Fatal(err)
	}
	return resp
}
