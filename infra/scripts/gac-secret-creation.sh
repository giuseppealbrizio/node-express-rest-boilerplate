#!/bin/zsh

# This command create a secret from a file that then will be mount on a deployment volume
# This command should be executed in the folder where tje JSON file is located

# google-application-credentials = secret name
# google-application-credentials.json = file that will be created in secret
# ./google-application-credentials.json = original json file downloaded from gcp

kubectl create secret generic google-application-credentials \
  --from-file=google-application-credentials.json=./google-application-credentials.json
