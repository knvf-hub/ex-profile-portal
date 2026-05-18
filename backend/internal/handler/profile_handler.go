package handler

import (
	"ex-profile/backend/internal/middleware"
	"ex-profile/backend/internal/service"
	"ex-profile/backend/internal/storage"

	"github.com/gofiber/fiber/v2"
)

type ProfileHandler struct {
	profiles *service.ProfileService
	files    *storage.FileStorage
}

func NewProfileHandler(profiles *service.ProfileService, files *storage.FileStorage) *ProfileHandler {
	return &ProfileHandler{profiles: profiles, files: files}
}

func (h *ProfileHandler) GetProfile(c *fiber.Ctx) error {
	user, ok := middleware.CurrentUser(c)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	profile, err := h.profiles.GetByUserID(user.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, err.Error())
	}

	return c.JSON(fiber.Map{"profile": profile})
}

func (h *ProfileHandler) UpdateContact(c *fiber.Ctx) error {
	user, ok := middleware.CurrentUser(c)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	var input service.UpdateContactInput
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid json body")
	}

	profile, err := h.profiles.UpdateContact(user.ID, input)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return c.JSON(fiber.Map{"profile": profile})
}

func (h *ProfileHandler) UpdateSkills(c *fiber.Ctx) error {
	user, ok := middleware.CurrentUser(c)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	var input struct {
		Skills []string `json:"skills"`
	}
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid json body")
	}

	profile, err := h.profiles.UpdateSkills(user.ID, input.Skills)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return c.JSON(fiber.Map{"profile": profile})
}

func (h *ProfileHandler) UpdatePhoto(c *fiber.Ctx) error {
	user, ok := middleware.CurrentUser(c)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	header, err := c.FormFile("photo")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "photo file is required")
	}

	imageURL, err := h.files.SaveProfilePhoto(header)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	profile, err := h.profiles.UpdatePhoto(user.ID, imageURL)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return c.JSON(fiber.Map{"profile": profile})
}

func (h *ProfileHandler) History(c *fiber.Ctx) error {
	user, ok := middleware.CurrentUser(c)
	if !ok {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
	}

	histories, err := h.profiles.History(user.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return c.JSON(fiber.Map{"history": histories})
}
