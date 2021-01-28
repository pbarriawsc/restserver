const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('servicios_tipos', {
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
            type: Sequelize.INTEGER
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