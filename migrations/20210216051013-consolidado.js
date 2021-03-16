'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('consolidado', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull:true
      },
      fk_cliente:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_propuesta:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      estado:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      prioridad:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      fk_usuario:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fecha:{
        type: Sequelize.DATE,
        allowNull:false
      },
      fk_contenedor:{
        type: Sequelize.INTEGER,
        allowNull:true
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
     await queryInterface.dropTable('consolidado');
  }
};
