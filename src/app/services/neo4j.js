const nj = require('../config/neo4j');

function addPerson(id) {
	nj.query("create (a:Person {id: $id})", {id:Integer =  nj.int(id)});
	return "Created Person with id: " + id;
}

async function listPeople() {
	return await nj.query("match (a:Person) return a.id as id");
}

function linkParent(parentId, childId, distance) {
	nj.query(
		"match (p:Person {id: $pid}), (c:Person {id: $cid}) create (p) -[:Parent {distance: $d}]-> (c)",
		{ pid:Integer = nj.int(parentId), cid:Integer = nj.int(childId), d:Integer = nj.int(distance) }
	);
	return `Linked ${parentId} to ${childId} with distance ${distance}`;
}

async function listFamily(id) {
	return await nj.query(
		"match (:Person {id: $id}) -[:Parent*0..]- (a:Person) match (a) -[r:Parent]-> (b:Person) return a.id as pid, b.id as cid, r.distance as dist",
		{id: Integer = nj.int(id)}
	)
}

module.exports = {
	addPerson,
	listPeople,
	linkParent,
	listFamily,
};
