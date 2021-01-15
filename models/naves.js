const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('naves', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
        },
        mmsi: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
		},
        imo: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
		},
        nombre: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
		},
        bandera: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
		},
        tipo: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },								
	});
};