const neo4j = require('neo4j-driver');
const driver = neo4j.driver('neo4j://neo4j', neo4j.auth.basic('neo4j', 'password'));

function recordToObj(rec) {
	let obj = {};
	for (var ind = 0; ind < rec.keys.length; ind++) {
		let key = rec.keys[ind];
		obj[key] = rec.get(key);
	}
	return obj;
}

async function query(...args) {
	let res = await driver.executeQuery(...args);
	return res.records.map(recordToObj);
}

module.exports = {
	query,
	recordToObj,
};
