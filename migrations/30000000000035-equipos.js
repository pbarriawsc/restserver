'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('equipos', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            estado: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
                unique: false,
            },
            patente: {
                allowNull: true,
                type: Sequelize.TEXT,
                unique: false,
            },
            anio: {
                allowNull: true,
                type: Sequelize.INTEGER,
                unique: false,
            },
            motor: {
                allowNull: true,
                type: Sequelize.TEXT,
                unique: false,
            },
            chasis: {
                allowNull: true,
                type: Sequelize.TEXT,
                unique: false,
            },
            asientos: {
                allowNull: true,
                type: Sequelize.INTEGER,
                unique: false,
            },
            fechaRevision: {
                allowNull: true,
                type: Sequelize.DATE,
                unique: false,
            },
            fechaPermiso: {
                allowNull: true,
                type: Sequelize.DATE,
                unique: false,
            },
            fk_responsable: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "usuario",
                        schema: "public",
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: false,
                unique: false,
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
            fk_marca: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "equipos_marcas",
                        schema: "public",
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: true,
                unique: false,
            },
            fk_modelo: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "equipos_modelos",
                        schema: "public",
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: true,
                unique: false,
            },
            fk_tipo: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "equipos_tipos",
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
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('equipos');
    }
};
