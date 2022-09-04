const { Router } = require('express');
const router = Router();
const { register, login, tokenChecker, changePassword } = require('../controllers/user');

router.post('/register', register);
router.post('/login', login);

router.post('/changePassword', tokenChecker, changePassword);

// TODO: change password
// ? By token check user oldPassword is valid if true change new password with hash

module.exports = router;
