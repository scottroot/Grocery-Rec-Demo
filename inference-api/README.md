# 🚀 Basic Embedding API Service (Sentence Transformers, FastAPI, Uvicorn)
This will be used on the demo site when **handling search queries**, or **computing product similarities** dynamically. 
There are many different ways we could do this - below is just one cheap and quick way.

⚡ **Skip this setup if you're using a premium inference API** (e.g., OpenAI, Cohere, etc.).

---

## 📌 Quick Setup on AWS EC2

### 1️⃣ **Connect to Your EC2 Ubuntu Instance**
```sh
ssh -i "my-aws-keypair.pem" ubuntu@ec2-##-###-##-###.compute-1.amazonaws.com
```

### 2️⃣ **Install Python & Dependencies**
```sh
# Install Miniconda (easier than installing Python directly)
mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh

# Activate Conda & Initialize
source ~/miniconda3/bin/activate
conda init --all

# Install required Python libraries
pip install sentence-transformers fastapi uvicorn
```

---

## 📜 Deploy the Inference Server

### 1️⃣ **Copy the Python Server Script to EC2**
```sh
scp -i "my-aws-keypair.pem" server.py ubuntu@ec2-##-###-##-###.compute-1.amazonaws.com:/home/ubuntu/
```

### 2️⃣ **Set Up as a Systemd Service**
Create a new service file at `/etc/systemd/system/inference-api.service`:

```ini
[Unit]
Description=FastAPI Sentence Transformer Embedding Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/
ExecStart=/home/ubuntu/miniconda3/bin/python /home/ubuntu/server.py
Restart=always
RestartSec=5
StandardOutput=append:/var/log/inference-api.log
StandardError=append:/var/log/inference-api.log

[Install]
WantedBy=multi-user.target
```

### 3️⃣ **Enable & Start the Service**
```sh
sudo systemctl daemon-reload
sudo systemctl enable inference-api
sudo systemctl start inference-api
sudo systemctl status inference-api  # Check if it's running
```

---

## 🛠️ Troubleshooting

- **Check logs:**
  ```sh
  tail -f /var/log/inference-api.log
  ```
- **Restart the service:**
  ```sh
  sudo systemctl restart inference-api
  ```
- **Stop the service:**
  ```sh
  sudo systemctl stop inference-api
  ```

---

## ✅ API Endpoints (Example)
Once running, the server should expose endpoints like:

- **GET /healthcheck** → Check if the API is live
- **GET /** → Get embeddings for input text

Example request:
```sh
curl -X GET "http://ec2-##-###-##-###.compute-1.amazonaws.com:8000/example+query"
```

