const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes_usuarios', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        fk_usuario: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                        tableName: "usuario",
                        schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false
        },
        estado: {
            allowNull: true,
            type: Sequelize.BOOLEAN,
            unique: false,
        },
	});
};
