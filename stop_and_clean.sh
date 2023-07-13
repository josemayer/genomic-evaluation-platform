#!/bin/bash

# Stop docker compose 
docker compose --profile dev down 

# clean the world
pushd world-generator/
make clean
popd
