const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
	sequelize.define('naves', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        mmsi: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
		},
        imo: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
		},
        nombre: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
		},
        bandera: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
		},
        tipo: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },								
	});
};