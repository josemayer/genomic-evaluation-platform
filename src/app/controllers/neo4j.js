const env = require('../config/env');
const service = require('../services/neo4j');

const OK = 200;
const INVALID = 400;

async function addPerson(req, res) {
	let { id } = req.params

	id = parseInt(id);

	if (isNaN(id)) {
		res.status(INVALID);
		res.json({ message: "Id can not be NaN" });
		return res;
	}

	res.status(OK);
	res.json({ message: service.addPerson(id) });

	return res;
}

async function listPeople(req, res) {
	res.status(OK);
	res.json(await service.listPeople());

	return res;
}

function linkParent(req, res) {
	let { parent, child, distance } = req.params

	parent = parseInt(parent);
	child = parseInt(child);
	distance = parseInt(distance);

	if (isNaN(parent)|| isNaN(child) || isNaN(distance)) {
		res.status(INVALID);
		res.json({message: "Arguments can not be NaN"});
		return res;
	}

	res.status(OK);
	res.json(service.linkParent(parent, child, distance))

	return res
}

async function listFamily(req, res) {
	let { id } = req.params

	id = parseInt(id);

	if (isNaN(id)) {
		res.status(INVALID);
		res.json({ message: "Id can not be NaN" });
		return res;
	}

	res.status(OK);
	res.json(await service.listFamily(id));

	return req;
}

module.exports = {
	addPerson,
	listPeople,
	linkParent,
	listFamily,
};
