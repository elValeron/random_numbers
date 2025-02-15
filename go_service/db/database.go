package db

import (
	"fmt"
	conn "go_service/config"
	"time"

	"gorm.io/driver/postgres"

	"gorm.io/gorm"
)

var DB *gorm.DB

func InitializeDatabase() {

	var err error

	connStr := conn.DatabaseConfig()
	DB, err = gorm.Open(postgres.Open(connStr), &gorm.Config{})
	if err != nil {
		fmt.Println("Failed to connect to the database:", err)
		return
	}

	err = DB.AutoMigrate(&MaxNumber{}, &Number{})
	if err != nil {
		fmt.Println("Failed to migrate database:", err)
	}
}

func SaveRandomNumbers(maxNumber int32, numbers []int32) error {
	maxNum := MaxNumber{Value: maxNumber}
	for _, num := range numbers {
		maxNum.RandomNumbers = append(maxNum.RandomNumbers, Number{Value: num})
	}
	return DB.Create(&maxNum).Error
}

func GetAverages(startDate, endDate time.Time, limit, offset int) (map[int32][]int32, error) {
	var uniqueMaxNumbers []MaxNumber
	if err := DB.Table("max_numbers").
		Where("created_at BETWEEN ? AND ? ", startDate, endDate).
		Select("DISTINCT ON (value) *").
		Order("value, created_at").
		Scan(&uniqueMaxNumbers).Error; err != nil {
		return nil, err
	}
	for i := range uniqueMaxNumbers {
		DB.Model(&uniqueMaxNumbers[i]).Association("RandomNumbers").Find(&uniqueMaxNumbers[i].RandomNumbers)
	}

	averages := make(map[int32][]int32)

	for _, maxNum := range uniqueMaxNumbers {
		var values []int32
		for _, num := range maxNum.RandomNumbers {
			values = append(values, num.Value)
		}
		averages[maxNum.Value] = values
	}
	return averages, nil
}
