const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('gc_clientes', {
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
		fk_contacto: {
				type: Sequelize.INTEGER,
				references: {
						model: {
								tableName: "gc_registrocontactos",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
				},
				allowNull: false
		},
		fk_cliente: {
				type: Sequelize.INTEGER,
				references: {
						model: {
								tableName: "clientes",
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
