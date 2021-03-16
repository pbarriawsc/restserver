const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes', {
		id: {
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
        },
        rut: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        nombre: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        razonSocial: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        web: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono1: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono2: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        dteEmail: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        aproComercial: {
            allowNull: true,
            type: Sequelize.INTEGER,
            unique: false,
        },
        aproFinanciera: {
            allowNull: true,
            type: Sequelize.INTEGER,
            unique: false,
        },
	});
};
