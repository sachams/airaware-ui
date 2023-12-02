app_name		= airaware-ui

shell:
	@echo "---> Starting bash shell in image"
	@touch ${HOME}/.bman_history
	@docker run -it --rm --name $(app_name) \
	--volume ${HOME}/.bman_history:/root/.bash_history \
	$(app_name) \
	bash
.PHONY: shell

build:
	@echo "---> Building development image"
	docker build \
	-t $(app_name) \
	 .
.PHONY: build

