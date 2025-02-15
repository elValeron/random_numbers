package db

import (
	"time"
)

type MaxNumber struct {
	ID            int32 `gorm:"primaryKey;autoIncrement:true"`
	Value         int32
	RandomNumbers []Number  `gorm:"foreignKey:MaxNumberID"`
	CreatedAt     time.Time `gorm:"type: date;default: now()"`
}

type Number struct {
	ID          int32 `gorm:"primaryKey"`
	Value       int32
	MaxNumberID int32 `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
