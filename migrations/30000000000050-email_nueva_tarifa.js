'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('email_nueva_tarifa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fk_cliente_contacto:{
        type: Sequelize.INTEGER,
        allowNull:true
      },
      email:{
        type: Sequelize.STRING,
        allowNull:false
      },
      fecha_envio:{
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
     await queryInterface.dropTable('email_nueva_tarifa');
  }
};
