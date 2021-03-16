'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('clientes', {
        id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
        },
        rut: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        codigo: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        razonSocial: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        web: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono1: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono2: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        dteEmail: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        aproComercial: {
            allowNull: true,
            type: Sequelize.INTEGER,
            unique: false,
        },
        aproFinanciera: {
            allowNull: true,
            type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('clientes');
  }
};
