'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('proveedores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        type: Sequelize.STRING
        , allowNull: true
      },
      fk_cliente: {
          type: Sequelize.INTEGER,
          references: {
              model: {
                  tableName: "clientes",
                  schema: "public",
              },
              key: "id",
              onDelete: "RESTRICT",
              onUpdate: "RESTRICT",
          },
          allowNull: true,
          unique: false,
      },
      codigoTributario: {
        type: Sequelize.STRING
        , allowNull: true
      },
      nombre: {
        type: Sequelize.STRING
        , allowNull: true
      },
      nombreChi: {
        type: Sequelize.STRING
        , allowNull: true
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
    await queryInterface.dropTable('proveedores');
  }
};
