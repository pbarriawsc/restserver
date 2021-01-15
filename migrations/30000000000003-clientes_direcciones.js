'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('clientes_direcciones', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        nombre: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        fk_cliente: {
          type: Sequelize.INTEGER,
          references: {
            model: {
                tableName: "clientes",
                schema: "public"
            },
            key: "id",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
          },
          allowNull: false
        },
        fk_tipo: {
          type: Sequelize.INTEGER,
          references: {
            model: {
                tableName: "direcciones_tipos",
                schema: "public"
            },
            key: "id",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
          },
          allowNull: false
        },
        fk_pais: {
          type: Sequelize.INTEGER,
          references: {
            model: {
                tableName: "pais",
                schema: "public"
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
                schema: "public"
            },
            key: "id",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
          },
          allowNull: false
        },
        fk_comuna: {
          type: Sequelize.INTEGER,
          references: {
            model: {
                tableName: "comunas",
                schema: "public"
            },
            key: "id",
            onDelete: "RESTRICT",
            onUpdate: "RESTRICT",
          },
          allowNull: false
        },
        direccion: {
          type: Sequelize.STRING
        },
        numero: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        radio: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        codigoPostal: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        referencia: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        lat: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        lon: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        comentario: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        estado: {
          type: Sequelize.INTEGER
        },
        fechaCreacion: {
            allowNull: false,
            type: Sequelize.DATE,
            unique: false,
        },
        fechaActualizacion: {
            allowNull: false,
            type: Sequelize.DATE,
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
    await queryInterface.dropTable('clientes_direcciones');
  }
};
