'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('sub_familias_comerciales_productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      codigo: {
        allowNull: true,
        primaryKey: false,
        unique: false,
        type: Sequelize.STRING
      },
      nombre: {
        allowNull: true,
        primaryKey: false,
        unique: false,
        type: Sequelize.STRING
      },
      fk_familia: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: "familias_comerciales_productos",
                schema: "public"
            },
            key: "id",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        },
        allowNull: true,
        primaryKey: false,
        unique: false,
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
    await queryInterface.dropTable('sub_familias_comerciales_productos');
  }
};
