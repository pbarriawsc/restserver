'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('bodega_ubicacion_detalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_bodega_ubicacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_contenedor:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fk_tracking_detalle:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fk_usuario:{
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
     await queryInterface.dropTable('bodega_ubicacion_detalle');
  }
};
