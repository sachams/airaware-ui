app_name		= airaware-ui

shell:
	@echo "---> Starting shell"
	@touch .bash_history
	@COMPOSE_DOCKER_CLI_BUILD=1 \
	 DOCKER_BUILDKIT=1 \
	 docker compose -f docker-compose-test.yml run \
	 --name server$(app_name) --service-ports --rm $(app_name) bash
.PHONY: shell

build:
	@echo "---> Building development image"
	@COMPOSE_DOCKER_CLI_BUILD=1 \
	 DOCKER_BUILDKIT=1 \
	 docker compose -f docker-compose-test.yml build $(app_name)
.PHONY: build

serve:
	@echo "---> Starting nginx server"
	@COMPOSE_DOCKER_CLI_BUILD=1 \
	 DOCKER_BUILDKIT=1 \
	 docker compose -f docker-compose-serve.yml up --build $(app_name)
.PHONY: serve
