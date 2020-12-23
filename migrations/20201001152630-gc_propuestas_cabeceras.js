'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
        await queryInterface.createTable('gc_propuestas_cabeceras', {
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
            servicio: {
                type: Sequelize.STRING
            },
            tipoCarga: {
                type: Sequelize.STRING
            },
            volumenEstimado: {
                type: Sequelize.FLOAT
            },
            pesoEstimado: {
                type: Sequelize.FLOAT
            },
            direccionDespacho: {
                type: Sequelize.STRING
            },
            fk_contacto: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "gc_registrocontactos",
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
        await queryInterface.dropTable('comunas');
    }
};
