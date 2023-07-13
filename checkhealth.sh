#!/bin/bash

# Check if localhost:4000 is up
curl localhost:4000/ &> /dev/null

if [ $? -eq 0 ]; then
  echo "localhost:4000 is up"
else
  echo "localhost:4000 is down"
  exit 1
fi

# Run tests for the app-dev container
docker compose exec app-dev npm test
