const { DataTypes } = require('sequelize');

module.exports = (sequelize,DataTypes) => {
	sequelize.define('comunas', {
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
        },
        codigo: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        nombre: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
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
        }
	});
};