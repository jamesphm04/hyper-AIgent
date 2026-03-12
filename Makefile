.PHONY: up down build clean

# Start the whole project
up:
	docker compose up

# Stop the whole project
down:
	docker compose down

# Build all images
build:
	docker compose build

# Clean up the project
clean:
	docker compose down -v --remove-orphans
	docker system prune -f