const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
	sequelize.define('equipos_tipos', {
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
	});
};