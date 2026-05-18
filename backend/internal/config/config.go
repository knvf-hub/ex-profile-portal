package config

import (
	"bufio"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	Port        string
	DBPath      string
	UploadDir   string
	SessionDays int
	HistoryDays int
	Skills      []string
}

func Load() Config {
	loadDotEnv(".env")

	return Config{
		Port:        getEnv("PORT", "8080"),
		DBPath:      getEnv("DB_PATH", "./data/app.db"),
		UploadDir:   getEnv("UPLOAD_DIR", "./uploads"),
		SessionDays: getEnvInt("SESSION_DAYS", 7),
		HistoryDays: getEnvInt("HISTORY_DAYS", 7),
		Skills:      splitCSV(getEnv("SKILLS", "Go,React,Flutter,CI/CD")),
	}
}

func loadDotEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		key, value, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}

		key = strings.TrimSpace(key)
		value = strings.Trim(strings.TrimSpace(value), `"'`)
		if key != "" {
			_ = os.Setenv(key, value)
		}
	}
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func getEnvInt(key string, fallback int) int {
	value, err := strconv.Atoi(getEnv(key, ""))
	if err != nil {
		return fallback
	}
	return value
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	items := make([]string, 0, len(parts))
	for _, part := range parts {
		item := strings.TrimSpace(part)
		if item != "" {
			items = append(items, item)
		}
	}
	return items
}
