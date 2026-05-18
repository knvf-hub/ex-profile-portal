package main

import (
	"log"
	"os"

	"ex-profile/backend/internal/config"
	"ex-profile/backend/internal/db"
	"ex-profile/backend/internal/handler"
	"ex-profile/backend/internal/middleware"
	"ex-profile/backend/internal/repository"
	"ex-profile/backend/internal/service"
	"ex-profile/backend/internal/storage"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	cfg := config.Load()

	if err := os.MkdirAll(cfg.UploadDir, 0755); err != nil {
		log.Fatal(err)
	}

	database, err := db.Init(cfg.DBPath)
	if err != nil {
		log.Fatal(err)
	}

	userRepo := repository.NewUserRepository(database)
	sessionRepo := repository.NewSessionRepository(database)
	profileRepo := repository.NewProfileRepository(database)
	historyRepo := repository.NewHistoryRepository(database)
	skillRepo := repository.NewSkillRepository(database)
	if err := skillRepo.Seed(cfg.Skills); err != nil {
		log.Fatal(err)
	}

	authService := service.NewAuthService(userRepo, sessionRepo, skillRepo, cfg.SessionDays)
	profileService := service.NewProfileService(profileRepo, historyRepo, skillRepo, cfg.HistoryDays)
	skillService := service.NewSkillService(skillRepo)

	authHandler := handler.NewAuthHandler(authService)
	profileHandler := handler.NewProfileHandler(profileService, storage.NewFileStorage(cfg.UploadDir))
	skillHandler := handler.NewSkillHandler(skillService)
	swaggerHandler := handler.NewSwaggerHandler("./docs/openapi.yaml")

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

	app.Use(cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			return origin == "" || origin == "http://localhost:5173"
		},
		AllowCredentials: true,
		AllowHeaders:     "Content-Type",
		AllowMethods:     "GET,POST,PATCH,OPTIONS",
	}))

	app.Get("/api/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})
	app.Get("/swagger", swaggerHandler.UI)
	app.Get("/swagger/", swaggerHandler.UI)
	app.Get("/swagger/openapi.yaml", swaggerHandler.Spec)
	app.Static("/uploads", cfg.UploadDir)

	api := app.Group("/api")
	api.Get("/config/skills", skillHandler.List)
	api.Post("/config/skills", authMiddleware, skillHandler.Create)

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/logout", authHandler.Logout)
	auth.Get("/me", authMiddleware, authHandler.Me)

	profile := api.Group("/profile", authMiddleware)
	profile.Get("", profileHandler.GetProfile)
	profile.Get("/", profileHandler.GetProfile)
	profile.Patch("/contact", profileHandler.UpdateContact)
	profile.Patch("/skills", profileHandler.UpdateSkills)
	profile.Patch("/photo", profileHandler.UpdatePhoto)
	profile.Get("/history", profileHandler.History)

	addr := ":" + cfg.Port
	log.Printf("server listening on %s", addr)
	if err := app.Listen(addr); err != nil {
		log.Fatal(err)
	}
}
