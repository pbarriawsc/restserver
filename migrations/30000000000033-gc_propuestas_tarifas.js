'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('gc_propuestas_tarifas', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            estado: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
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
            fk_zonaAlmacenaje: {
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
            tipoDeCarga: {
                allowNull: false,
                type: Sequelize.TEXT,
                unique: false,
            },
            cmbPeso: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            unidadesACobrar: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            valorUnitarioUsd: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            valorBaseUsd: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            tarifaUsd: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            Pb_cmbPeso: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            Pb_unidadesACobrar: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            Pb_valorUnitarioUsd: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            Pb_valorBaseUsd: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            volumenEstimado: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
            pesoEstimado: {
                allowNull: true,
                type: Sequelize.FLOAT,
                unique: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gc_propuestas_tarifas');
    }
};
