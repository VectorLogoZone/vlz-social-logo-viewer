#!/bin/bash
#docker login -u oauth2accesstoken -p "$(gcloud auth print-access-token)" https://gcr.io

docker build -t vlz-api .
docker tag vlz-api:latest gcr.io/vectorlogozone/api:latest
docker push gcr.io/vectorlogozone/api:latest

gcloud beta run deploy vlz-api \
	--image gcr.io/vectorlogozone/api \
	--platform managed \
	--project vectorlogozone \
    --region us-central1 \
	--update-env-vars "COMMIT=$(git rev-parse --short HEAD),GA_ID=UA-328425-25,LASTMOD=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
