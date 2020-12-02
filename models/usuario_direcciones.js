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
	sequelize.define('usuario_direcciones', {
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
    pais: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
    },
    region: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
    },
    comuna: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
    },
    direccion: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
    },
    numero: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
        },
    latitud: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
        },
    longitud: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
        },
    radio: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
        },
	});
};