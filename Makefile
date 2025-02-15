COMPOSE_FILE = docker-compose.yaml
.DEFAULT_GOAL := help
.PHONY: up down rebuild db-shell help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Запуск docker compose
	docker compose -f $(COMPOSE_FILE) up -d

down: ## Остановка и удаление контейнеров
	docker compose -f $(COMPOSE_FILE) down

rebuild: ## Перезапуск контейнеров
	docker compose -f $(COMPOSE_FILE) down
	docker compose -f $(COMPOSE_FILE) up -d

db-shell: ## Запуск psql в контейнере с БД
	docker compose -f $(COMPOSE_FILE) exec -it db psql -d $(DB_NAME) -U $(DB_USER)