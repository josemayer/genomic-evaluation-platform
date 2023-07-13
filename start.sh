#!/bin/bash

# Check dependencies
if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v make)" ]; then
  echo 'Error: make is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v python3)" ]; then
  echo 'Error: python3 is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v g++)" ]; then
  echo 'Error: g++ is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v find)" ]; then
  echo 'Error: find is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v sed)" ]; then
  echo 'Error: sed is not installed.' >&2
  exit 1
fi

# Create .env files from the sample .env.sample files
for f in $(find . -name .env.sample); 
    do cp $f $(echo $f | sed 's/.sample//g'); 
done

# Generate the world
pushd world-generator/
make
popd

# Run docker compose
docker compose --profile dev build
docker compose --profile dev up
