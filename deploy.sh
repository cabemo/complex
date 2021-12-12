docker build \
  -t cabemo/multi-client:latest \
  -t cabemo/multi-client:$SHA \
  -f ./client/Dockerfile ./client
docker build \
  -t cabemo/multi-server:latest \
  -t cabemo/multi-server:$SHA \
  -f ./server/Dockerfile ./server
docker build \
  -t cabemo/multi-worker:latest \
  -t cabemo/multi-worker:$SHA \
  -f ./worker/Dockerfile ./worker
for image in client server worker; do docker push cabemo/multi-$image; docker push cabemo/multi-$image:$SHA; done
kubectl apply -f k8s
kubectl set image deployments/server-deployment server=cabemo/multi-server:$SHA
kubectl set image deployments/client-deployment client=cabemo/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=cabemo/multi-worker:$SHA
