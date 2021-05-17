'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('clientes_contactos_archivos', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fk_contacto: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                        tableName: "clientes_contactos",
                        schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false
        },
        cedula_1:{
            type: Sequelize.BLOB,
            allowNull: true,
        },
        cedula_1_type: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        cedula_1_ext: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        cedula_2:{
             type: Sequelize.BLOB,
             allowNull: true,
        },
        cedula_2_type: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        cedula_2_ext: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        podersimple_1:{
             type: Sequelize.BLOB,
             allowNull: true,
        },
        podersimple_1_type: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        podersimple_1_ext: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        podersimple_2:{
             type: Sequelize.BLOB,
             allowNull: true,
        },
        podersimple_2_type: {
             allowNull: true,
             type: Sequelize.STRING,
             unique: false,
        },
        podersimple_2_ext: {
             allowNull: true,
             type: Sequelize.STRING,
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
     await queryInterface.dropTable('clientes_contactos_archivos');
  }
};
