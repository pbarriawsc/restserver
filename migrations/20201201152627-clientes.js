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
			type: DataTypes.INTEGER
        },
        rut: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
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
        razonSocial: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        web: {
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
        dteEmail: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: false,
        },
        aproComercial: {
            allowNull: false,
            type: DataTypes.INTEGER,
            unique: false,
        },
        aproFinanciera: {
            allowNull: false,
            type: DataTypes.INTEGER,
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
