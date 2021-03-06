'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('tracking_detalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      upload_id:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fecha_recepcion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fecha_consolidado: {
        type: Sequelize.DATE,
        allowNull: true
      },
      codigo_interno:{
        type: Sequelize.STRING,
        allowNull: true
      },
      tipo_producto:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      producto:{
        type: Sequelize.STRING,
        allowNull: false
      },
      peso:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      volumen:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      observacion:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      tracking_id:{
        type: Sequelize.INTEGER,
        allowNull: false
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
      ancho:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      alto:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      altura:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_consolidado_tracking_detalle:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ubicacion:{
        type: Sequelize.STRING,
        allowNull: true
      },
      fk_contenedor:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_nave:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      fk_nave_eta: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
       currier:{
        type: Sequelize.STRING,
        allowNull: true,
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
     await queryInterface.dropTable('tracking_detalle');
  }
};
