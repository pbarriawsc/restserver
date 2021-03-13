'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('tracking', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha_creacion: {
        type: Sequelize.DATE
      },
      fecha_recepcion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cantidad_bultos: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      peso: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      volumen: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tipo_carga:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_proveedor:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_cliente:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tipo:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estado:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      foto1:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      foto2:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      foto3:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      foto4:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      foto5:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      packing_list1:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      packing_list2:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      invoice1:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      invoice2:{
        type: Sequelize.BLOB,
        allowNull: true,
      },
      currier:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      fk_propuesta:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_consolidado_tracking:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      prioridad:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_proveedor_cliente:{
        type: Sequelize.INTEGER,
        allowNull: true,
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
     await queryInterface.dropTable('tracking');
  }
};
