'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('contenedor_historial', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          fk_usuario:{
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          fk_contenedor:{
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          fk_nave_1: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          fk_nave_eta_1: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          fk_nave_2: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          fk_nave_eta_2: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          fecha: {
            type: Sequelize.DATE,
            allowNull: false,
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
      await queryInterface.dropTable('contenedor_historial');
  }
};
