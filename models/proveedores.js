const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('proveedores', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		  },
		  codigo: {
			type: Sequelize.STRING
			, allowNull: true
		  },
		  codigoTributario: {
			type: Sequelize.STRING
			, allowNull: true
		  },
		  nombre: {
			type: Sequelize.STRING
			, allowNull: true
		  },
		  nombreChi: {
			type: Sequelize.STRING
			, allowNull: true
		  },
			fk_cliente: {
					type: Sequelize.INTEGER,
					references: {
							model: {
									tableName: "clientes",
									schema: "public",
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
