const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('gc_propuestas_estados', {
		id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
		},
		nombre: {
				allowNull: true,
				type: Sequelize.TEXT,
				unique: false,
		},
	});
};
