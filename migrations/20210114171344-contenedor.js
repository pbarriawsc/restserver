'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('contenedor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reserva: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_nave: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      viaje: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      volumen:{
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      estado: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_nave: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_nave_eta: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_linea_naviera: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_embarcadora: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numero_sello: {
        type: Sequelize.STRING,
        allowNull: true,
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
     await queryInterface.dropTable('contenedor');
  }
};
