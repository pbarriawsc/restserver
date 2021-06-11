'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.createTable('kardex', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_contenedor: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      codigo_interno: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fk_tracking:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fk_bodega_ubicacion:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      entrada:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      salida:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      saldo:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      peso:{
        type: Sequelize.FLOAT,
        allowNull: true
      },
      peso_saldo:{
        type: Sequelize.FLOAT,
        allowNull: true
      },
      volumen:{
        type: Sequelize.FLOAT,
        allowNull: true
      },
      volumen_saldo:{
        type: Sequelize.FLOAT,
        allowNull: true
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
     await queryInterface.dropTable('kardex');
  }
};
