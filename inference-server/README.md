ec2-44-203-75-109.compute-1.amazonaws.com

ssh -i "aws-neo4j-keypair.pem" ubuntu@ec2-44-203-75-109.compute-1.amazonaws.com


mkdir -p ~/miniconda3
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh
bash ~/miniconda3/miniconda.sh -b -u -p ~/miniconda3
rm ~/miniconda3/miniconda.sh

source ~/miniconda3/bin/activate

conda init --all

pip install sentence-transformers fastapi uvicorn