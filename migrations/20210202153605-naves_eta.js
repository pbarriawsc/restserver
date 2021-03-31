'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('naves_eta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_nave: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      viaje_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_puerto:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      eta_fecha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      eta_hora: {
        type: Sequelize.TIME,
        allowNull: true
      },
      staa_fecha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      staa_hora: {
        type: Sequelize.TIME,
        allowNull: true
      },
      stab_fecha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      stab_hora: {
        type: Sequelize.TIME,
        allowNull: true
      },
      etd_fecha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      etd_hora: {
        type: Sequelize.TIME,
        allowNull: true
      },
      tipo:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estado:{
        type: Sequelize.INTEGER,
        allowNull: false,
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
     await queryInterface.dropTable('naves_eta');
  }
};
