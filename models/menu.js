const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('menu', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
        },
        nombre: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        permiso: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        menuPadre: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        url: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
	});
};