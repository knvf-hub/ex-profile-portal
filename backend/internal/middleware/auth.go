package middleware

import (
	"ex-profile/backend/internal/model"
	"ex-profile/backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

const userContextKey = "current_user"

func Auth(auth *service.AuthService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := c.Cookies("session_token")
		if token == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
		}

		user, err := auth.CurrentUser(token)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "internal server error")
		}
		if user == nil {
			return fiber.NewError(fiber.StatusUnauthorized, "unauthorized")
		}

		c.Locals(userContextKey, user)
		return c.Next()
	}
}

func CurrentUser(c *fiber.Ctx) (*model.User, bool) {
	user, ok := c.Locals(userContextKey).(*model.User)
	return user, ok
}
