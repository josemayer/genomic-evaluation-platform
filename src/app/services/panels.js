const pg = require('../config/postgres');

async function addPanelTypeWithConditions(description, conditions_id_list) {
  try {
    pg.query('BEGIN', [], 'user');

    const panel_type_inserted = await pg.query(
      'INSERT INTO tipo_painel (descricao) VALUES ($1) RETURNING *',
      [description], 'user'
    );

    const panel_type_id = panel_type_inserted.rows[0].id;

    for (let i = 0; i < conditions_id_list.length; i++) {
      await pg.query(
        'INSERT INTO pode_identificar_condicao (tipo_painel_id, condicao_id) VALUES ($1, $2)',
        [panel_type_id, conditions_id_list[i]], 'user'
      );
    }

    pg.query('COMMIT', [], 'user');

    return panel_type_inserted.rows[0]
  } catch (err) {
    pg.query('ROLLBACK', [], 'user');
    throw err;
  }
  return null;
}

module.exports = {
  addPanelTypeWithConditions,
};
