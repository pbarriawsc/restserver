'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('comunas', {
        id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
        },
        codigo: {
        type: Sequelize.STRING
        },
        nombre: {
        type: Sequelize.STRING
        },
        fk_pais: {
        type: Sequelize.INTEGER,
        references: {
            model: {
                tableName: "pais",
                schema: "Authentication"
            },
            key: "id",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
        },
        allowNull: false
        },
        fk_region: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "region",
                    schema: "Authentication"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false
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
    await queryInterface.dropTable('comunas');
  }
};
