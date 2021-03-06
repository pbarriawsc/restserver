const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('gc_contactos_tipos', {
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
	});
};