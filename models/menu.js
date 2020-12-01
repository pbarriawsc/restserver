const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
	sequelize.define('menu', {
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
        permiso: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        menuPadre: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        url: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
	});
};