'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('gc_contactos_tipos', {
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
        fk_tipo: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "gc_contactos_tipos ",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false
        },
        fk_comercial: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "usuario ",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false
        },
        nombres: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        apellidos: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        telefono1: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        telefono2: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        texto: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
    });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gc_contactos_tipos');
    }
};
