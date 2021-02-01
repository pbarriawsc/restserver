'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.createTable('gc_propuestas_serviciosadicionales', {
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
            origen: {
                type: Sequelize.STRING
            },
            destino: {
                type: Sequelize.STRING
            },
            tarifa: {
                type: Sequelize.FLOAT
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
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('gc_propuestas_tarifas');
    }
};
