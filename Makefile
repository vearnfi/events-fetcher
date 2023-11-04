dev-up:
		docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up

dev-up-build:
		docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up --build

stag-up:
		docker-compose -f docker-compose.yaml -f docker-compose.stag.yaml up

stag-up-build:
		docker-compose -f docker-compose.yaml -f docker-compose.stag.yaml up --build

prod-up:
		docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up

prod-up-build:
		docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build

down:
		docker-compose down
