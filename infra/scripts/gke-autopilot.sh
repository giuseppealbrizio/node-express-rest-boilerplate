#!/bin/zsh
echo -e "\e[0;33mAutomate GKE Autopilot Cluster creation.\e[0m"

# Before everything set the Google cloud project to the desired one
#gcloud config set project google-cloud-project-id

# If we have already a cluster we can change context like this
#gcloud container clusters get-credentials cluster-name

# To execute the script
#chmod +x gke-autopilot.sh && ./gke-autopilot.sh

PROJECT_NAME=$(gcloud config get-value project)
REGION=europe-west1
ZONE=b

# CREATE GKE AUTOPILOT CLUSTER

# Set the project to the desired one
gcloud config set project $PROJECT_NAME

# Set zone and region
gcloud config set compute/zone $REGION-$ZONE
gcloud config set compute/region $REGION

# Enable compute and container api
gcloud services enable container.googleapis.com compute.googleapis.com

# Create a static ip address
gcloud compute addresses create $PROJECT_NAME-static-ip \
  --global

# List all the ips created
gcloud compute addresses list

# Finally create the cluster
gcloud container clusters create-auto $PROJECT_NAME-cluster \
  --region $REGION

#Submit the docker image to the gcp registry

#gcloud builds submit --tag <gcr.io/project-name/service> .


