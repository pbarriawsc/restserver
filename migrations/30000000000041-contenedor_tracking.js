'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
      await queryInterface.createTable('contenedor_tracking', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_contenedor:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_usuario_creacion:{
        type: Sequelize.INTEGER,
        allowNull:false
      },
      fk_usuario_modificacion:{
        type: Sequelize.INTEGER,
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
     await queryInterface.dropTable('contenedor_tracking');
  }
};
