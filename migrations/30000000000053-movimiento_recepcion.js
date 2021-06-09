'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('movimiento_recepcion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_contenedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_tracking_detalle: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_usuario:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      opcion:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fecha:{
        type: Sequelize.DATE,
        allowNull:false
      },
      estado:{
        type: Sequelize.INTEGER,
        allowNull:false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('movimiento_recepcion');
  }
};
