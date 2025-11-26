.PHONY: help install dev build up down logs clean test

# Variables
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.yml
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yml

help: ## Mostrar esta ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Instalar dependencias del backend
	cd backend && npm install

dev: ## Levantar el entorno de desarrollo
	$(DOCKER_COMPOSE_DEV) up --build

up: ## Levantar contenedores en segundo plano
	$(DOCKER_COMPOSE_DEV) up -d

down: ## Detener y eliminar contenedores
	$(DOCKER_COMPOSE_DEV) down

logs: ## Ver logs de los contenedores
	$(DOCKER_COMPOSE_DEV) logs -f

logs-backend: ## Ver logs solo del backend
	$(DOCKER_COMPOSE_DEV) logs -f backend

logs-frontend: ## Ver logs solo del frontend
	$(DOCKER_COMPOSE_DEV) logs -f frontend

restart: ## Reiniciar contenedores
	$(DOCKER_COMPOSE_DEV) restart

build: ## Construir imágenes sin cache
	$(DOCKER_COMPOSE_DEV) build --no-cache

clean: ## Limpiar contenedores, volúmenes e imágenes
	$(DOCKER_COMPOSE_DEV) down -v --rmi all

test: ## Ejecutar tests del backend
	cd backend && npm test

test-coverage: ## Ejecutar tests con cobertura
	cd backend && npm run test:coverage

lint: ## Ejecutar linter
	cd backend && npm run lint

format: ## Formatear código
	cd backend && npm run format

shell-backend: ## Abrir shell en el contenedor del backend
	$(DOCKER_COMPOSE_DEV) exec backend sh

shell-frontend: ## Abrir shell en el contenedor del frontend
	$(DOCKER_COMPOSE_DEV) exec frontend sh

prod-up: ## Levantar entorno de producción
	$(DOCKER_COMPOSE_PROD) up -d

prod-down: ## Detener entorno de producción
	$(DOCKER_COMPOSE_PROD) down

prod-logs: ## Ver logs de producción
	$(DOCKER_COMPOSE_PROD) logs -f

status: ## Ver estado de los contenedores
	$(DOCKER_COMPOSE_DEV) ps