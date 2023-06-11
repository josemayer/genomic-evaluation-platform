const neo4j = require('neo4j-driver');
const env = require('./env').dbs.neo4j;
const driver = neo4j.driver(env.host, neo4j.auth.basic(env.user, env.password));

function recordToObj(rec) {
	let obj = {};
	for (var ind = 0; ind < rec.keys.length; ind++) {
		let key = rec.keys[ind];
		obj[key] = rec.get(key);

		if (neo4j.isInt(obj[key])) {
			obj[key] = obj[key].toInt();
		}

	}
	return obj;
}

async function query(...args) {
	let e;
	let res = await driver.executeQuery(...args).catch(error => { e = error; return undefined });
	if (res === undefined) {
		console.log(e.code);
		return {};
	}
	return res.records.map(recordToObj);
}

function int(x) {
	return neo4j.int(x);
}

module.exports = {
	query,
	recordToObj,
	int,
};
