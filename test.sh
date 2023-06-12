#!/bin/bash

# Run tests for the app-dev container
docker compose exec app-dev npm test

# Search all users example
curl localhost:4000/redis/searchAllUsers

# Find user conditions example
curl localhost:4000/redis/findUserConditions/1
curl localhost:4000/redis/findUserConditions/2
