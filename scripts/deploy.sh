#!/bin/bash

# Build application
echo "Building application..."
npm run build

# Run tests
echo "Running tests..."
npm test

if [ $? -eq 0 ]; then
  # Deploy to production
  echo "Deploying to production..."
  docker build -t chat-api:latest -f Dockerfile.prod .
  docker push your-registry/chat-api:latest

  # Update production server
  ssh production "cd /app && \
    docker-compose pull && \
    docker-compose up -d && \
    docker system prune -f"

  echo "Deployment completed successfully"
else
  echo "Tests failed, deployment aborted"
  exit 1
fi 