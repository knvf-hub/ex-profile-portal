package db

import (
	"ex-profile/backend/internal/model"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Init(path string) (*gorm.DB, error) {
	database, err := gorm.Open(sqlite.Open(path), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})
	if err != nil {
		return nil, err
	}

	if err := dropLegacyProfileSkillTable(database); err != nil {
		return nil, err
	}

	if err := database.AutoMigrate(
		&model.User{},
		&model.Session{},
		&model.Profile{},
		&model.Skill{},
		&model.EmployeeSkill{},
		&model.ChangeHistory{},
	); err != nil {
		return nil, err
	}

	return database, nil
}

func dropLegacyProfileSkillTable(database *gorm.DB) error {
	if !database.Migrator().HasTable("skills") {
		return nil
	}

	rows, err := database.Raw("PRAGMA table_info(skills)").Rows()
	if err != nil {
		return err
	}

	hasLegacyProfileID := false
	for rows.Next() {
		var cid int
		var name string
		var columnType string
		var notNull int
		var defaultValue any
		var pk int
		if err := rows.Scan(&cid, &name, &columnType, &notNull, &defaultValue, &pk); err != nil {
			return err
		}

		if name == "profile_id" {
			hasLegacyProfileID = true
			break
		}
	}
	if err := rows.Err(); err != nil {
		_ = rows.Close()
		return err
	}
	if err := rows.Close(); err != nil {
		return err
	}

	if !hasLegacyProfileID {
		return nil
	}

	if err := database.Exec("DROP TABLE IF EXISTS employee_skills").Error; err != nil {
		return err
	}
	return database.Exec("DROP TABLE IF EXISTS skills").Error
}
