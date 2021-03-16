const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('bodegas', {
		id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
		},
		estado: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
				unique: false,
		},
		nombre: {
				allowNull: false,
				type: Sequelize.TEXT,
				unique: false,
		},
		fk_zonaTarifaria: {
				type: Sequelize.INTEGER,
				references: {
						model: {
								tableName: "zonas_tarifarias",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
				},
				allowNull: true,
				unique: false,
		},
		fk_empresa: {
				type: Sequelize.INTEGER,
				references: {
						model: {
								tableName: "empresas",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
				},
				allowNull: true,
				unique: false,
		},
	});
};
