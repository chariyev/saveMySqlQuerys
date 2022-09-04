const { Op } = require('sequelize');
const models = require('../models');

const exportObj = {};

exportObj.createNewScript = async (req, res, next) => {
  const { script } = req.body;
  if (!script) {
    res.status(404).json({ status: 'failed', message: 'script is required' });
    return;
  }

  models.SqlScript.create({ sqlScript: script, UserId: req._userId })
    .then((script) => {
      res.json(script);
    })
    .catch((err) => {
      res.status(500).json({ status: 'failed', message: err.message });
    });
};

exportObj.getScript = async (req, res, next) => {
  models.SqlScript.findAll({ where: { UserId: req._userId } })
    .then((scripts) => {
      res.json(scripts);
    })
    .catch((err) => {
      res.status(500).json({ status: 'failed', message: 'Somthing went wrong' });
    });
};

exportObj.updateScript = async (req, res, next) => {
  // TODO: id check if not exists return 400
  // TODO: check script has by id
  // TODO: check script belongsTo user
  // TODO: update script and save return resualt
};

exportObj.deleteScript = async (req, res, next) => {
  // TODO: id check if not exists return 400
  // TODO: check script has by id
  // TODO: check script belongsTo user
  // TODO: delete script and save return resualt
};

module.exports = exportObj;
