const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes_direcciones', {
				id: {
					allowNull: false,
					autoIncrement: true,
					primaryKey: true,
					type: Sequelize.INTEGER
				},
				nombre: {
					type: Sequelize.STRING
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
				fk_tipo: {
					type: Sequelize.INTEGER,
					references: {
						model: {
								tableName: "direcciones_tipos",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
					},
					allowNull: false
				},
				fk_pais: {
					type: Sequelize.INTEGER,
					references: {
						model: {
								tableName: "pais",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
					},
					allowNull: false
				},
				fk_region: {
					type: Sequelize.INTEGER,
					references: {
						model: {
								tableName: "region",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
					},
					allowNull: false
				},
				fk_comuna: {
					type: Sequelize.INTEGER,
					references: {
						model: {
								tableName: "comunas",
								schema: "public"
						},
						key: "id",
						onDelete: "RESTRICT",
						onUpdate: "RESTRICT",
					},
					allowNull: false
				},
				direccion: {
					type: Sequelize.STRING
				},
				numero: {
					type: Sequelize.STRING
				},
				radio: {
					type: Sequelize.STRING
				},
				codigoPostal: {
					type: Sequelize.STRING
				},
				referencia: {
					type: Sequelize.STRING
				},
				lat: {
					type: Sequelize.STRING
				},
				lon: {
					type: Sequelize.STRING
				},
				comentario: {
					type: Sequelize.STRING
				},
				estado: {
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
