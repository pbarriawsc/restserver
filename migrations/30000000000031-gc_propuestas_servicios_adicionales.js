'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('gc_propuestas_servicios_adicionales', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            estado: {
                allowNull: false,
                type: Sequelize.INTEGER,
                unique: false,
            },
            bloqueo: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
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
            fk_cabecera: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "gc_propuestas_cabeceras",
                        schema: "public"
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: false
            },
            fk_tipoDeServicio: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "servicios_tipos",
                        schema: "public",
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: true,
                unique: false,
            },
            fk_zonaOrigen: {
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
            fk_zonaDestino: {
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
            tarifa: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            base_tarifa: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gc_propuestas_servicios_adicionales');
    }
};
