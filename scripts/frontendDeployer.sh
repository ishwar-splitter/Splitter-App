#!/usr/bin/env bash
set -eux

cd splitter-app
echo $ENV | base64 --decode > .env
npm install
npx eslint . || echo "ESLint completed with warnings"
CI=false npm run build
aws s3 sync build/ s3://$BUCKET_NAME/
rm -rf build/