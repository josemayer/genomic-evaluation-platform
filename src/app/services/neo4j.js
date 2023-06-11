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
		"match (p:Person {id: $pid}), (c:Person {id: $cid}) merge (p) -[:Parent {distance: $d}]-> (c)",
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

function addCondition(id) {
	nj.query("create (a:Condition {id: $id})", {id:Integer =  nj.int(id)});
	return "Created Condition with id: " + id;
}

function linkHasCondition(personId, conditionId) {
	nj.query(
		"match (p:Person {id: $pid}), (c:Condition {id: $cid}) merge (p) -[:Has]-> (c)",
		{ pid:Integer = nj.int(personId), cid:Integer = nj.int(conditionId) }
	);
	return `Linked person ${personId} with condition ${conditionId}`;
}

async function listPersonConditions(personId) {
	return await nj.query(
		"match (:Person {id: $pid}) -[:Has]-> (c:Condition) return c.id as id",
		{ pid:Integer = nj.int(personId) }
	);
}

module.exports = {
	addPerson,
	listPeople,
	linkParent,
	listFamily,
	addCondition,
	linkHasCondition,
	listPersonConditions,
};
