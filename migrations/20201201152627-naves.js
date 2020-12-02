'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('naves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mmsi: {
        type: Sequelize.STRING
      },
      imo: {
        type: Sequelize.STRING
      },
      nombre: {
        type: Sequelize.STRING
      },
      bandera: {
        type: Sequelize.STRING
      },  
      tipo: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('naves');
  }
};
