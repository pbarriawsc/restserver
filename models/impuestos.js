const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
	sequelize.define('impuestos', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        codigo: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        nombre: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        valor: {
            allowNull: false,
            type: DataTypes.FLOAT,
            unique: false,
        },
	});
};