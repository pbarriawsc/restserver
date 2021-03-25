'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('bodegas_ubicaciones', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          nombre: {
              allowNull: false,
              type: Sequelize.TEXT,
              unique: false,
          },
          estado: {
              allowNull: false,
              type: Sequelize.BOOLEAN,
              unique: false,
          },
          fk_bodega: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "bodegas",
                    schema: "public",
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
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
     await queryInterface.dropTable('bodegas_ubicaciones');
  }
};
