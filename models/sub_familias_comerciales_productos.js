const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('sub_familias_comerciales_productos', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		codigo: {
			allowNull: true,
			primaryKey: false,
			unique: false,
			type: Sequelize.STRING
		},
		nombre: {
			allowNull: true,
			primaryKey: false,
			unique: false,
			type: Sequelize.STRING
		},
		fk_familia: {
			type: Sequelize.INTEGER,
			references: {
					model: {
							tableName: "familias_comerciales_productos",
							schema: "public"
					},
					key: "id",
					onDelete: "RESTRICT",
					onUpdate: "RESTRICT",
			},
			allowNull: true,
			primaryKey: false,
			unique: false,
	}
	});
};
