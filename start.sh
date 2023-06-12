#!/bin/bash

# Create .env files from the simple .env.sample files
for f in $(find . -name .env.sample); do cp $f $(echo $f | sed 's/.sample//g'); done

# Delete all .env files 
# rm $(find . -name .env)

docker compose --profile dev build
docker compose --profile dev up
