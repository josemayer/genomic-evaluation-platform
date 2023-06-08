const nj = require('../config/neo4j');

async function addPerson(id) {
	nj.query("create (a:Person {id: $id})", {id: id});
	return "Created Person with id: " + id;
}

async function listPeople() {
	const people = await nj.query("match (a:Person) return a.id as id");
	return people;
}

module.exports = {
	addPerson,
	listPeople,
};
