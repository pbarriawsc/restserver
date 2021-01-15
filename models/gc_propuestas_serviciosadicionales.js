const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('gc_propuestas_serviciosadicionales', {
		id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
		},
		estado: {
				allowNull: false,
				type: Sequelize.INTEGER
		},
		origen: {
				type: Sequelize.STRING
		},
		destino: {
				type: Sequelize.STRING
		},
		tarifa: {
				type: Sequelize.FLOAT
		},
		fk_cabecera: {
				type: Sequelize.INTEGER,
				references: {
						model: {
								tableName: "gc_propuestas_cabeceras",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
				},
				allowNull: false
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
