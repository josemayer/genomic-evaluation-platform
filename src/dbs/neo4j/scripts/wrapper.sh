#!/bin/bash

IFS='/' read -ra AUTH <<< "$NEO4J_AUTH"
NEO4J_USER="${AUTH[0]}"
NEO4J_PASSWORD="${AUTH[1]}"

/startup/docker-entrypoint.sh neo4j &

# Wait for Neo4j to start
until wget -q --spider http://localhost:7474; do
    sleep 1
done

for file in /cypher/*.cypher; do
    cypher-shell -u $NEO4J_USER -p $NEO4J_PASSWORD < $file
done

tail -f /dev/null
