const conditions = require('../services/conditions');
const auth = require('../services/auth');

async function addCondition(req, res) {
  const body = req.body;
  const auth_header = req.headers.authorization;

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header'
    });
    return res;
  }

  try {
    const user = auth.decodeToken(auth_header);

    const description = body.description;
    const condition_name = body.condition_name;
    const prob_pop = body.prob_pop;

    /** @type {{sequence: string, probabilityInPopulation: string, probabilityGivenSequence: string}[]} */
    const genetic_information = body.genetic_information;

    const conditionResult = await conditions.addCondition(
        description,
        condition_name,
        prob_pop,
        genetic_information,
    );

    console.log(conditionResult);

    res.status(200);
    res.json({
      condition_id:  conditionResult,
    });
  } catch(err) {
    res.status(err.statusCode || 500);
    res.json({ message: err.message });
  }
  return res;
}

module.exports = {
  addCondition,
};
