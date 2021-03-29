'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('viajes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull:true
      },
      keyaux:{
        type: Sequelize.STRING,
        allowNull:true
      },
      estado:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_usuario:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_nave:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      fecha_creacion:{
        type: Sequelize.DATE,
        allowNull:false
      },
      fecha_modificacion:{
        type: Sequelize.DATE,
        allowNull:true
      },
      fecha_termino:{
        type: Sequelize.DATE,
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
     await queryInterface.dropTable('viajes');
  }
};
