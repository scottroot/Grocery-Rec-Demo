# Set up basic embedding API service
We will use this on the demo site when users search, or when we need to get product similarities on the fly. 
There are many different ways we could do this - below is just one cheap and quick way.

**Skip this if you are using a premium inference API (i.e. OpenAI) instead of running your own.**

  
## Example setup on AWS EC2
### Setup Python
```sh
ssh -i "my-aws-keypair.pem" ubuntu@ec2-##-###-##-###.compute-1.amazonaws.com

mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh

source ~/miniconda3/bin/activate

conda init --all

pip install sentence-transformers fastapi uvicorn
```

## Setup script as systemd service
Copy Python script to server.
```sh
scp -i "my-aws-keypair.pem" server.py ubuntu@ec2-##-###-##-###.compute-1.amazonaws.com:/home/ubuntu/
```

System service (for /etc/systemd/system/)
```
[Unit]
Description=FastAPI Sentence Transformer Embedding Service
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/
ExecStart=/home/ubuntu/miniconda3/bin/python /home/ubuntu/server.py
Restart=always
RestartSec=5
StandardOutput=append:/var/log/inference_service.log
StandardError=append:/var/log/inference_service.log

[Install]
WantedBy=multi-user.target
```