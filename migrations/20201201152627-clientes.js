'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('clientes', {
        id: {
    			allowNull: false,
    			autoIncrement: true,
    			primaryKey: true,
    			type: Sequelize.INTEGER
        },
        estado: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            unique: false,
        },
        rut: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: false,
        },
        codigo: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        razonSocial: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        web: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono1: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        telefono2: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        dteEmail: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        aproComercial: {
            allowNull: true,
            type: Sequelize.INTEGER,
            unique: false,
        },
        aproFinanciera: {
            allowNull: true,
            type: Sequelize.INTEGER,
            unique: false,
        },
        codigoSii: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        giro: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        repLegalRut: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        repLegalNombre: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        repLegalApellido: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        repLegalMail: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
        fk_responsable: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "usuario",
                    schema: "public",
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false,
            unique: false,
        },
        fk_comercial: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "usuario",
                    schema: "public",
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false,
            unique: false,
        },
    },{
		    initialAutoIncrement: 2500
	  });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('clientes');
  }
};
