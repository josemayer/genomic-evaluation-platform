const auth = require('../services/auth');
const panels = require('../services/panels');
const structuresHelper = require('../helpers/structures');
const permissionsHelper = require('../helpers/permissions');

async function registerPanelWithConditions(req, res) {
  const auth_header = req.headers.authorization;
  const body = req.body;
  const user = auth.decodeToken(auth_header);

  if (!auth_header) {
    res.status(400);
    res.json({
      message: 'Required authorization header',
    });
    return res;
  }

  if (!body.description || !body.conditions_id_list) {
    res.status(400);
    res.json({
      message: 'Required description and conditions_id_list',
    });
    return res;
  }

  if (!structuresHelper.isArray(body.conditions_id_list)) {
    res.status(400);
    res.json({
      message: 'conditions_id_list must be an array',
    });
    return res;
  }

  if (permissionsHelper.isOnlyClient(user.userData.types)) {
    res.status(401);
    res.json({
      message: 'Unauthorized to register a new type of panel',
    });
    return res;
  }

  try {
    const panel = await panels.addPanelTypeWithConditions(body.description, body.conditions_id_list);

    res.status(200);
    res.json({ panel });
  } catch (err) {
    res.status(err.status_code || 500);
    res.json({
      message: err.message
    });
  }
  return res;
}

async function listAllPanelsTypes(req, res) {
  res.status(200);
  res.json(await panels.listAllPanelTypes())
}

module.exports = {
  registerPanelWithConditions,
  listAllPanelsTypes,
};
