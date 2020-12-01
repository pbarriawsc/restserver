'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nombre: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: false,
      },
      permiso: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: false,
      },
      menuPadre: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: false,
      },
      url: {
          allowNull: false,
          type: DataTypes.STRING,
      }  
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('menu');
  }
};