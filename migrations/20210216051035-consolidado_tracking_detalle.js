'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('consolidado_tracking_detalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_consolidado: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_tracking: {
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_tracking_detalle: {
        type: Sequelize.INTEGER,
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
     await queryInterface.dropTable('consolidado_tracking_detalle');
  }
};
