const { Router } = require('express');
const { Op } = require('sequelize');
const models = require('../models');

const router = Router();
const controlllers = require('../controllers/sqlScript');

router.post('/', controlllers.createNewScript);
router.get('/', controlllers.getScript);
router.delete('/:id', controlllers.deleteScript);
router.put('/:id', controlllers.updateScript);

module.exports = router;
