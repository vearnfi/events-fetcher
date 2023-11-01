up-dev:
		docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up

up-stag:
		docker-compose -f docker-compose.yaml -f docker-compose.stag.yaml up

up-prod:
		docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up

down:
		docker-compose down
