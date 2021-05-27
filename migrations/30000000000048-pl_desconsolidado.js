'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('pl_desconsolidado', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_contenedor:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      fk_usuario_creacion:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_usuario_modificacion:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      fk_usuario_descarga:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      fecha_creacion:{
        type: Sequelize.DATE,
        allowNull:true
      },
      fecha_descarga:{
        type: Sequelize.DATE,
        allowNull:true
      },
      estado:{
        type: Sequelize.INTEGER,
        allowNull:false
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
     await queryInterface.dropTable('pl_desconsolidado');
  }
};
