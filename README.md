# customer-microservice-soaring-clouds-sequel

Repository for the Customer Microservice, part of the Soaring Through The Clouds Sequel

## Run with Docker-Compose locally

1) Install docker and docker-compose

2) Run the following command

```bash
	docker-compose up
```
This will run 2 container images:

- Mongo database for Orders MS
- Customer Microservice (available in: http://localhost:8080/customer) --see API blueprint (/src/api) for methods supported and sample payloads. This service also publishes events to Kafka topic: "a516817-soaring-user-sign-ins"
- Mongo Database

2) To bring down gratefully run:

```bash
	docker-compose down
```

## To create Deployment/Service in Kubernetes:

1) Make sure that he image name in docker-compose and customer-ms.yml match

2) Build the docker image and push to Docker Hub

Build:
```bash
	docker-compose build
```

Push to docker hub:
```bash
	docker login --username=<username>
	docker push <username>/customer-ms:1.0.0
```

3) Set Kubectl file to match your target Kubernetes environment e.g.

```bash
	export KUBECONFIG=<PATH>/kubeconfig
```

4) Create Kubectl namespace if not done already (already done!)

```bash
	kubectl create -f k8s-namespace-customer.json
```
Check that namespace is create

```bash
	kubectl get namespaces --show-labels
```

5) Create Kubectl customer context locally

Define "customer" context for the kubectl client to work with. NOTE: values for cluster and user were taken from running “kubectl config view”

```bash
	kubectl config set-context customer --namespace=customer-ms --cluster=cluster-cc128a199f4 --user=user-cc128a199f4
```

Switch to "customer" context

```bash
	kubectl config use-context customer
```

6) Create Deployments and Services

```bash
	kubectl create -f cust-mongo-db.yml
	kubectl create -f customer-ms.yml
	kubectl create -f ingress.yml
```

7) To get the external IP Customer Microservice is listening to the following commands:

```bash
	kubectl get pods -o wide
```
 Take note of the "Node" IP for "customer-ms-xxx". Then run the following command to obtain the port:

```bash
	kubectl get services customer-ms
	kubectl get ingress rest-customer-ing
```

8) To delete the services (if required)

```bash
	kubectl delete deploy cust-mongo-db
	kubectl delete service cust-mongo-db

	kubectl delete deploy customer-ms
	kubectl delete service customer-ms

	kubectl delete ingress rest-customer-ing
```

## TO-DO

- Figure out how to use ingress as currently is not working. Connecting API Gateway directly to Service IP/Port which isn't ideal
