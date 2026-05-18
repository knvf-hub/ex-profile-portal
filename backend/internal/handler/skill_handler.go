package handler

import (
	"ex-profile/backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

type SkillHandler struct {
	skills *service.SkillService
}

func NewSkillHandler(skills *service.SkillService) *SkillHandler {
	return &SkillHandler{skills: skills}
}

func (h *SkillHandler) List(c *fiber.Ctx) error {
	skills, err := h.skills.List()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return c.JSON(fiber.Map{"skills": skills})
}

func (h *SkillHandler) Create(c *fiber.Ctx) error {
	var input struct {
		Name string `json:"name"`
	}
	if err := c.BodyParser(&input); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid json body")
	}

	skill, err := h.skills.Create(input.Name)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"skill": skill})
}
