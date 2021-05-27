'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('pl_desconsolidado_detalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_pl_desconosolidado: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_tracking_detalle: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      opcion: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
     await queryInterface.dropTable('pl_desconsolidado_detalle');
  }
};
