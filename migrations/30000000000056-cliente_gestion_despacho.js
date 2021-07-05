'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('cliente_gestion_despacho', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_contenedor: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fk_cliente:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fk_cliente_direccion_despacho:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha_despacho:{
        type: Sequelize.DATE,
        allowNull:true
      },
      observacion_despacho:{
        type: Sequelize.TEXT,
        allowNull:true
      },
      tipo_despacho:{
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0
      },
      fk_usuario:{
        type: Sequelize.INTEGER,
        allowNull: false
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
     await queryInterface.dropTable('cliente_gestion_despacho');
  }
};
