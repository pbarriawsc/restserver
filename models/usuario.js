/*'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    
    static associate(models) {
    }
  };
  usuario.init({
    id: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'usuario',
    define:{
      schema: "public"
    }
  });
  return usuario;
};*/

const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize,DataTypes) => {
	sequelize.define('usuario', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		nombre: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: false,
    },
    password: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: false,
		},
	});
};