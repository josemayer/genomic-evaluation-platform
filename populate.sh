#!/bin/bash

# Add redis user example
curl localhost:4000/redis/addUser/1/aatcgat-aaaatttggccaat
curl localhost:4000/redis/addUser/2/aacgcgagtat-aaatggccaat
curl localhost:4000/redis/addUser/3/aaccccccggggaagttat-aaatggccaat
curl localhost:4000/redis/addUser/4/acgcgtgtgcgtgctatat-cgcgggtgtgtgcg-tgtgtgtgaaaattcccc
curl localhost:4000/redis/addUser/5/attcgcccgccgctt-aaatggccaat

# Add redis condition example
curl localhost:4000/redis/addCondition/1/0.2/aatcgatatatatgat:0.5:0.2-aatgccga:0.5:0.2-tgtgtgtgaaaattcccc:0.2:0.3
curl localhost:4000/redis/addCondition/2/0.8/aatcgatagatagatagcct:0.3:0.2-aatgccga:0.5:0.2
curl localhost:4000/redis/addCondition/3/0.1/aatcgat:0.5:0.2-aaatggccaat:0.2:0.1
curl localhost:4000/redis/addCondition/5/0.0008/aatcgat:1.0:1.0-aatgccga:0.08:0.9

# Add neo4j example data 
curl localhost:4000/neo4j/addPerson/0
curl localhost:4000/neo4j/addPerson/1
curl localhost:4000/neo4j/addPerson/2
curl localhost:4000/neo4j/addPerson/3
curl localhost:4000/neo4j/addPerson/4

curl localhost:4000/neo4j/linkParent/0/2/1
curl localhost:4000/neo4j/linkParent/1/2/1
curl localhost:4000/neo4j/linkParent/2/4/1
curl localhost:4000/neo4j/linkParent/3/4/1

curl localhost:4000/neo4j/addCondition/0
curl localhost:4000/neo4j/addCondition/1
curl localhost:4000/neo4j/addCondition/2

curl localhost:4000/neo4j/linkHasCondition/2/0
curl localhost:4000/neo4j/linkHasCondition/2/1
