const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('zonas_tarifarias', {
		id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        nombre: {
            allowNull: false,
            type: Sequelize.TEXT
        },
        estado: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },            
        fechaCreacion: {
            allowNull: false,
            type: Sequelize.DATE,
            unique: false,
        },
        fechaActualizacion: {
            allowNull: false,
            type: Sequelize.DATE,
            unique: false,
        },
	});
};