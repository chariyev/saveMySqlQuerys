'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SqlScript extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      User.hasMany(this);
      // define association here
    }
  }
  SqlScript.init(
    {
      sqlScript: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'SqlScript',
    }
  );
  return SqlScript;
};
