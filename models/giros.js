const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('giros', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
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
	});
};