# Employee Profile Portal Backend

Go backend for the Employee Profile Portal assignment.

## Run

```bash
go run ./cmd/api
```

Default server:

```txt
http://localhost:8080
```

## Swagger

Start the backend, then open:

```txt
http://localhost:8080/swagger/
```

Raw OpenAPI spec:

```txt
http://localhost:8080/swagger/openapi.yaml
```

Swagger UI uses the `session_token` cookie automatically after calling `POST /api/auth/register` or `POST /api/auth/login`.

## Debug With Logs

Run normally:

```bash
go run ./cmd/api
```

Useful checks:

```bash
curl -i http://localhost:8080/api/health
curl -i http://localhost:8080/swagger/openapi.yaml
```

Register and save cookies:

```bash
curl -i -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Pheerawat",
    "last_name": "Frank",
    "email": "frank@example.com",
    "password": "secret123",
    "phone": "0812345678",
    "address": "Bangkok",
    "skills": ["Go", "React"]
  }' \
  http://localhost:8080/api/auth/register
```

Call protected profile API with the saved cookie:

```bash
curl -i -b cookies.txt http://localhost:8080/api/profile
```

Update contact:

```bash
curl -i -b cookies.txt \
  -X PATCH \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0899999999",
    "email": "contact@example.com",
    "address": "Pathumwan"
  }' \
  http://localhost:8080/api/profile/contact
```

Check history:

```bash
curl -i -b cookies.txt http://localhost:8080/api/profile/history
```

List skill catalog:

```bash
curl -i http://localhost:8080/api/config/skills
```

Add a new skill, then assign it to the logged-in profile:

```bash
curl -i -b cookies.txt \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"name": "Kubernetes"}' \
  http://localhost:8080/api/config/skills

curl -i -b cookies.txt \
  -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"skills": ["Go", "Kubernetes"]}' \
  http://localhost:8080/api/profile/skills
```

## Debug With VS Code

Install the Go extension, then create `.vscode/launch.json` at the project root or backend folder:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "go",
      "request": "launch",
      "mode": "debug",
      "program": "${workspaceFolder}/cmd/api",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

Set breakpoints in handlers/services, start `Debug Backend`, then call APIs from Swagger or curl.

## Debug With Delve CLI

Install Delve if needed:

```bash
go install github.com/go-delve/delve/cmd/dlv@latest
```

Run debugger:

```bash
dlv debug ./cmd/api
```

Common Delve commands:

```txt
b internal/handler/auth_handler.go:34
c
n
s
p input
bt
q
```

## Test

```bash
go test ./...
```
