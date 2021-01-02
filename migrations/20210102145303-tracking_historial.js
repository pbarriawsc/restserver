'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.createTable('tracking_historial', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      accion:{
        type: Sequelize.STRING,
        allowNull: true
      },
      observacion:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      fk_usuario:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fk_tracking:{
        type: Sequelize.INTEGER,
        allowNull: false
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
     await queryInterface.dropTable('tracking_historial');
  }
};
