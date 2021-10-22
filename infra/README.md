#INFRASTRUCTURE FOLDER

This folder should be moved to the root folder where all the services are located.

- `k8s` folder contains all production kubernetes manifests
- `k8s-dev` folder contains all development kubernetes manifests to run with skaffold
- `scripts` folder contains all script related to the creation of a cluster or running skaffold or secret creation

## Skaffold File

`./k8s/skaffold.yaml`

Remember to put this file in the root of multi-services project. Depending on the environment, you should specify the
correct skaffold configuration.

- If you use Docker, you should install NGINX at this link
  [NGINX x Docker](https://kubernetes.github.io/ingress-nginx/deploy/)

## USEFUL COMANDS

- Change the context of kubernetes

```bash
kubectl config use-context <clustern-name>
```

- Build the container in gcloud with the command. In the root where Dockerfile is located

```bash
gcloud builds submit --tag gcr.io/<gcp-project-id>/<image-name> .
```

- CREATE SECRET FROM JSON FILE
  - google-application-credentials = the name of the secret to be stored
  - google-application-credentials.json = the file name and the file will be stored in a volume
  - ./google-application-credentials.json = the actual file downloaded and that is in the config folder

```bash
kubectl create secret generic google-application-credentials --from-file=google-application-credentials.json=./google-application-credentials.json
```
