dev-up:
		docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml up

stag-up:
		docker-compose -f docker-compose.yaml -f docker-compose.stag.yaml up

prod-up:
		docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up

down:
		docker-compose down
