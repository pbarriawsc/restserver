const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
        },
        rut: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        codigo: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        nombre: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        razonSocial: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        web: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono1: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono2: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        dteEmail: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        aproComercial: {
            allowNull: false,
            type: Sequelize.INTEGER,
            unique: false,
        },
        aproFinanciera: {
            allowNull: false,
            type: Sequelize.INTEGER,
            unique: false,
        },
	});
};