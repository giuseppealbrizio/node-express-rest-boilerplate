#!/bin/zsh
echo -e "\e[0;33mAutomate GCP K8S cluster creation.\e[0m"

#Set the project

#gcloud config set project <your-project-name>

#Echoing the project name

#gcloud config get-value project

#Create a cluster with auto-pilot

#gcloud container clusters create-auto <cluster-name> --region europe-west1

# List all the ips created

#gcloud compute addresses list

# Create a static ip address

#gcloud compute addresses create <ip-name> --global

#Submit the docker image to the gcp registry

#gcloud builds submit --tag <gcr.io/project-name/service> .


