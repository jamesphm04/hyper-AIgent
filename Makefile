APP_NAME=hyper-AIgent

.PHONY: dev prod down logs clean

dev:
	NODE_ENV=development FE_DOCKERFILE=Dockerfile.dev BE_DOCKERFILE=Dockerfile.dev docker compose up --build

prod:
	NODE_ENV=production FE_DOCKERFILE=Dockerfile BE_DOCKERFILE=Dockerfile docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker system prune -f