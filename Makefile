SERVER_TAG=cabemo/multi-server
CLIENT_TAG=cabemo/multi-client
WORKER_TAG=cabemo/multi-worker

build-server:
	docker build -t ${SERVER_TAG} ./server

build-client:
	docker build -t ${CLIENT_TAG} ./client

build-worker:
	docker build -t ${WORKER_TAG} ./worker

build: build-server build-client build-worker

deploy: build
	for image in ${SERVER_TAG} ${CLIENT_TAG} ${WORKER_TAG}; do docker push $$image; done
