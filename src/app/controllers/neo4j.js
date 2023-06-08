const env = require('../config/env');
const service = require('../services/neo4j');

async function addPerson(req, res, next) {
	const { id } = req.params

	res.status(200);
	res.json({ message: await service.addPerson(id) });

	next();
	return res
}

async function listPeople(req, res, next) {
	res.status(200);
	res.json(await service.listPeople());

	next()
	return res;
}

module.exports = {
	addPerson,
	listPeople,
};
