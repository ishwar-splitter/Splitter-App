#!/usr/bin/env bash
set -eux

cd splitter-app
echo $ENV | base64 --decode > .env
npm install
npm run build
aws s3 sync build/ s3://$BUCKET_NAME/
rm -rf dist/