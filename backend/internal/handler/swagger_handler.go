package handler

import (
	"os"

	"github.com/gofiber/fiber/v2"
)

type SwaggerHandler struct {
	specPath string
}

func NewSwaggerHandler(specPath string) *SwaggerHandler {
	return &SwaggerHandler{specPath: specPath}
}

func (h *SwaggerHandler) UI(c *fiber.Ctx) error {
	c.Set("Content-Type", "text/html; charset=utf-8")
	return c.SendString(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Employee Profile Portal API</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/swagger/openapi.yaml",
        dom_id: "#swagger-ui",
        presets: [SwaggerUIBundle.presets.apis],
        layout: "BaseLayout",
        withCredentials: true
      });
    </script>
  </body>
</html>`)
}

func (h *SwaggerHandler) Spec(c *fiber.Ctx) error {
	content, err := os.ReadFile(h.specPath)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "openapi spec not found")
	}

	c.Set("Content-Type", "application/yaml; charset=utf-8")
	return c.Send(content)
}
