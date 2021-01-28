'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('formas_pago', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            codigo: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: false,
            },
            nombre: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: false,
            },
            valor: {
                allowNull: false,
                type: Sequelize.FLOAT,
                unique: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('formas_pago');
    }
};