package storage

import (
	"errors"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

type FileStorage struct {
	dir string
}

func NewFileStorage(dir string) *FileStorage {
	return &FileStorage{dir: dir}
}

func (s *FileStorage) SaveProfilePhoto(header *multipart.FileHeader) (string, error) {
	if header == nil {
		return "", errors.New("photo file is required")
	}

	if err := os.MkdirAll(s.dir, 0755); err != nil {
		return "", err
	}

	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext == "" {
		ext = ".jpg"
	}

	name := uuid.NewString() + ext
	path := filepath.Join(s.dir, name)

	out, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer out.Close()

	file, err := header.Open()
	if err != nil {
		return "", err
	}
	defer file.Close()

	if _, err := io.Copy(out, file); err != nil {
		return "", err
	}

	return "/uploads/" + name, nil
}
