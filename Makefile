dev-up:
		docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up

dev-up-build:
		docker-compose --env-file .env.dev -f docker-compose.yaml -f docker-compose.dev.yaml up --build

dev-build:
		docker-compose --env-file .env.dev -f docker-compose.yaml -f docker-compose.dev.yaml build

stag-up:
		docker-compose -f docker-compose.yaml -f docker-compose.stag.yaml up

stag-up-build:
		docker-compose --env-file .env.stag -f docker-compose.yaml -f docker-compose.stag.yaml up --build

stag-build:
		docker-compose --env-file .env.stag -f docker-compose.yaml -f docker-compose.stag.yaml build

prod-up:
		docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up

prod-up-build:
		docker-compose --env-file .env.prod -f docker-compose.yaml -f docker-compose.prod.yaml up --build

prod-build:
		docker-compose --env-file .env.prod -f docker-compose.yaml -f docker-compose.prod.yaml build

down:
		docker-compose down
