const { Op } = require('sequelize');
const models = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwt_key = process.env.JWT_KEY;
const expiresIn = '1d';

const createNewToken = async (payload = {}) => {
  return await jwt.sign(payload, jwt_key, {
    expiresIn,
  });
};

const exportObj = {};

exportObj.register = async (req, res, next) => {
  const { firstName, lastName, email, password, username, phoneNumber } = req.body;

  if (!firstName || !lastName || !email || !password || !username || !phoneNumber) {
    res.status(400).json({
      status: 'failed',
      message: 'Some properties required: firstName, lastName, email, password, username, phoneNumber',
    });
    return;
  }
  const hashPassword = await bcrypt.hash(password, 10);

  models.User.create({ firstName, lastName, email, password: hashPassword, username, phoneNumber })
    .then(async (user) => {
      const token = await createNewToken({ id: user.id });

      res.json({ token });
    })
    .catch((err) => {
      res.status(500).json({ status: 'failed', message: 'Somthing went wrong', err });
    });
};

exportObj.login = async (req, res, next) => {
  const { password, username } = req.body;

  if (!password || !username) {
    res.status(400).json({
      status: 'failed',
      message: 'Some properties required: password, username',
    });
    return;
  }

  models.User.findOne({
    where: {
      [Op.or]: [{ username: { [Op.iLike]: username } }, { email: { [Op.iLike]: username } }],
    },
    attributes: ['firstName', 'lastName', 'password'],
  })
    .then(async (user) => {
      if (!user) {
        res.status(404).json({ status: 'failed', message: 'User not found' });
        return;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const token = await createNewToken({ id: user.id });
        const user_ = user.toJSON();
        delete user_.password;

        res.json({ ...user_, token });
      } else {
        res.status(400).json({ status: 'failed', message: 'Password is incorrect' });
      }
    })
    .catch((err) => {
      res.status(500).json({ status: 'failed', message: 'Somthing went wrong', err });
    });
};

exportObj.tokenChecker = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const jt = await jwt.verify(token, jwt_key);
      req._userId = jt.id;
      next();
      return;
    } catch (error) {
      res.status(401).json({ status: 'failed', message: 'Unauthorized' });
      return;
    }
  }
  res.status(401).json({ status: 'failed', message: 'Unauthorized' });
};

exportObj.changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ status: 'failed', message: 'Old password and new password is required' });
    return;
  }
  const user = await models.User.findByPk(req._userId);
  if (!user) {
    res.status(404).json({ status: 'failed', message: 'User not found' });
  }

  const valid = await bcrypt.compare(oldPassword, user.password);
  if (valid) {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    res.json({ status: 'success', message: 'Password saved successfully' });
  } else {
    res.status(400).json({ status: 'failed', message: 'Old password is incorrect' });
  }
};

module.exports = exportObj;
