1.  Build the container in gcloud with the command. In the root where Dockerfile is located

```bash
gcloud builds submit --tag gcr.io/<gcp-project-id>/<image-name> .
```

2. Create a static ip address to use later in the ingress

```bash
gcloud compute addresses create <service-ip-name> --global
```
