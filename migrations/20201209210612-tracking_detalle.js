'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('tracking_detalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha_recepcion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fecha_consolidado: {
        type: Sequelize.DATE,
        allowNull: true
      },
      tipo_producto:{
        type: Sequelize.STRING,
        allowNull: false
      },
      producto:{
        type: Sequelize.STRING,
        allowNull: false
      },
      peso:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      observacion:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      tracking_id:{
        type: Sequelize.INTEGER,
        allowNull: false
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
     await queryInterface.dropTable('tracking_detalle');
  }
};
