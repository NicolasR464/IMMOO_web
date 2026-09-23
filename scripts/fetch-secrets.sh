#!/bin/bash
# Regenerates .env.local from Google Cloud Secret Manager (project: immoo-506522).
# Run this instead of hand-editing .env.local. Requires: gcloud auth login
# (already done once) + secretmanager.secretAccessor on this project.
set -euo pipefail
cd "$(dirname "$0")/.."

fetch() { gcloud secrets versions access latest --secret="$1" --project=immoo-506522; }

cat > .env.local <<EOF
NEXT_PUBLIC_LOCAL_API=http://localhost:3000/api
LOCAL_API=http://localhost:3000/api
PUBLIC_APP_URL=http://localhost:3000

# GOOGLE OAUTH
## LOCAL
AUTH_GOOGLE_ID=$(fetch immoo-web-auth-google-id)
AUTH_GOOGLE_SECRET=$(fetch immoo-web-auth-google-secret)

### Auth Secret
AUTH_SECRET=$(fetch immoo-web-auth-secret)

## STAGING
AUTH_GOOGLE_ID_STAGING=$(fetch immoo-web-auth-google-id-staging)
AUTH_GOOGLE_SECRET_STAGING=$(fetch immoo-web-auth-google-secret-staging)

## LIVE
AUTH_GOOGLE_ID_LIVE=$(fetch immoo-web-auth-google-id-live)
AUTH_GOOGLE_SECRET_LIVE=$(fetch immoo-web-auth-google-secret-live)

## API
SCRAPPER_BASE_URL="http://localhost:8000/api"
NEXT_PUBLIC_SCRAPPER_BASE_URL="http://localhost:8000/api"
EOF

chmod 600 .env.local
echo "wrote .env.local ($(grep -c '=' .env.local) vars — values not printed)"
