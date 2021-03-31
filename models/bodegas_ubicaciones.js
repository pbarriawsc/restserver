const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('bodegas_ubicaciones', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
		},
		estado: {
				allowNull: true,
				type: Sequelize.BOOLEAN,
				unique: false,
		},
		nombre: {
			allowNull: true,
			primaryKey: false,
			unique: false,
			type: Sequelize.STRING
		},
		fk_bodega: {
			type: Sequelize.INTEGER,
			references: {
					model: {
							tableName: "bodegas",
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
