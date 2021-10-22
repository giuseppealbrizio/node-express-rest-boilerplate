#!/bin/zsh
echo -e "\e[0;33mAutomate GKE Standard Cluster creation.\e[0m"

# Before everything set the Google cloud project to the desired one
#gcloud config set project name-of-your-project

# If we have already a cluster we can change context like this
#gcloud container clusters get-credentials <cluster-name>

# To execute the script
#chmod +x script.sh && ./script.sh

PROJECT_NAME=$(gcloud config get-value project)
REGION=europe-west1
ZONE=b

# CREATE GKE STANDARD CLUSTER

# Set the project to the desired one
gcloud config set project $PROJECT_NAME

# Set zone and region
gcloud config set compute/zone $REGION-$ZONE
gcloud config set compute/region $REGION

# Enable compute and container api
gcloud services enable container.googleapis.com compute.googleapis.com

# Create network
gcloud compute networks create $PROJECT_NAME-network \
  --subnet-mode=custom

# Create subnet
gcloud compute networks subnets create $PROJECT_NAME-subnet \
  --network=$PROJECT_NAME-network \
  --range=10.0.0.0/24

# Finally create the cluster
gcloud container clusters create $PROJECT_NAME-cluster \
  --zone "$REGION-$ZONE" \
  --machine-type "n1-standard-1" \
  --disk-size "10" \
  --num-nodes "1" \
  --enable-ip-alias \
  --network "projects/$PROJECT_NAME/global/networks/$PROJECT_NAME-network" \
  --subnetwork "projects/$PROJECT_NAME/regions/$REGION/subnetworks/$PROJECT_NAME-subnet" \
  --node-locations "$REGION-$ZONE"

# Install latest version of Skaffold
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
sudo install skaffold /usr/local/bin/
rm ./skaffold
