# 🚀 Scalable Event-Driven Activity Logger

![Node.js](https://img.shields.io/badge/Node.js-v18-green) ![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s-blue) ![Kafka](https://img.shields.io/badge/Kafka-Confluent-orange) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Docker](https://img.shields.io/badge/Docker-Enabled-blue)

A cloud-native microservices application designed to ingest, stream, and store user activity logs at scale. This project demonstrates an **Event-Driven Architecture** using **Apache Kafka** to decouple high-throughput log ingestion from storage operations.

---

## 🌐 Live Demo
The application is currently deployed on an **AWS EC2** instance running a K3s Kubernetes cluster.

> **Base URL:** [http://54.173.192.160/api/logs](http://54.173.192.160/api/logs)
>
> *Note: Viewing the link in a browser performs a GET request, which retrieves stored logs. To create new logs, use the POST method (see Usage below).*

---

## 🏗 System Architecture

The system follows a **Producer-Consumer** pattern to ensure the API remains responsive even under heavy load.

```mermaid
graph LR
    User(Client) -->|POST /logs| API[API Service]
    API -->|Produce Event| Kafka[Confluent Cloud Kafka]
    Kafka -->|Consume Event| Worker[Consumer Worker]
    Worker -->|Save Document| DB[(MongoDB Atlas)]
    User -.->|GET /logs| API
    API -.->|Query| DB
Key Components:Ingestion Service (API): A lightweight Node.js/Express REST API. It accepts requests and immediately offloads them to Kafka.Message Broker (Kafka): Acts as a durable buffer, ensuring no logs are lost if the database is temporarily slow or down.Processing Service (Consumer): A dedicated worker that reads from Kafka and handles the I/O intensive task of writing to MongoDB.Storage (MongoDB): Cloud-native document storage for flexible log schemas.📂 Project StructureBash├── src/
│   ├── config/         # Database and Kafka configuration
│   ├── interfaces/     # HTTP Routes and Server logic
│   ├── services/       # Business logic (Producer/Consumer)
│   └── app.js          # Entry point
├── k8s/                # Kubernetes Manifests (Deployment, Service, Ingress)
├── k8s-secrets.example.yaml # Template for security credentials
├── Dockerfile          # Container definition
└── README.md           # Documentation
🛠️ Setup & InstallationPrerequisitesNode.js v18+Docker & Kubectl (for cluster deployment)Access to MongoDB Atlas & Confluent Cloud (Kafka)1. Security Configuration (Crucial)Sensitive credentials are not included in this repository.To run the project, duplicate the example secret file and add your credentials:Bashcp k8s-secrets.example.yaml k8s-secrets.yaml
Edit k8s-secrets.yaml with your actual connection strings and API keys.2. Run Locally (Docker)You can run the full stack locally using Docker.Bash# Build the image
docker build -t activity-log-app .

# Run the container (ensure env vars are passed or use a .env file)
docker run -p 3000:3000 activity-log-app
3. Deploy to KubernetesThis project is optimized for Kubernetes (tested on K3s).Bash# 1. Apply Secrets (Ensure k8s-secrets.yaml is created first)
kubectl apply -f k8s-secrets.yaml

# 2. Deploy Microservices & Ingress
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# 3. Verify Deployment
kubectl get pods -w
📡 API Usage1. Create a Log (Producer)Send a log entry to the system. It will be queued in Kafka immediately.Request:Bashcurl -X POST [http://54.173.192.160/api/logs](http://54.173.192.160/api/logs) \
  -H "Content-Type: application/json" \
  -d '{"userId": "12345", "action": "User_Login", "metadata": {"ip": "192.168.1.1"}}'
Response:JSON{
  "status": "Logged",
  "traceId": "a1b2c3d4",
  "message": "Event queued successfully"
}
2. Retrieve Logs (Read)Fetch the history of processed logs from MongoDB.Request:Bashcurl -X GET [http://54.173.192.160/api/logs](http://54.173.192.160/api/logs)
🧠 Design Decisions & Trade-offsDecisionReasonWhy Kafka?To decouple the API from the Database. If MongoDB slows down during peak traffic, the API remains fast because it only talks to Kafka.Why Microservices?Scaling the Consumer (Worker) independently from the API. We can run 1 API pod and 5 Workers if write-volume is high.Why Kubernetes?Provides self-healing (restarts crashed pods) and easy secrets management compared to raw VM scripts.SecuritySecrets are injected via K8s environment variables, keeping them out of the source code image.

🚀 Future Improvements
- CI/CD Pipeline: Implement GitHub Actions to auto-deploy on push.
- Monitoring: Add Prometheus/Grafana to visualize Kafka lag and API latency.