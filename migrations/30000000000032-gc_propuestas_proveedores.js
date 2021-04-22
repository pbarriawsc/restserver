'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('gc_propuestas_proveedores', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
          },
          estado: {
              allowNull: false,
              type: Sequelize.INTEGER,
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
          fk_proveedor: {
              type: Sequelize.INTEGER,
              references: {
                  model: {
                      tableName: "proveedores",
                      schema: "public",
                  },
                  key: "id",
                  onDelete: "RESTRICT",
                  onUpdate: "RESTRICT",
              },
              allowNull: true,
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
          fk_direccion: {
              type: Sequelize.INTEGER,
              references: {
                  model: {
                      tableName: "clientes_direcciones",
                      schema: "public",
                  },
                  key: "id",
                  onDelete: "RESTRICT",
                  onUpdate: "RESTRICT",
              },
              allowNull: true,
              unique: false,
          },
          volumen: {
              allowNull: true,
              type: Sequelize.FLOAT,
              unique: false,
          },
          bultos: {
              allowNull: true,
              type: Sequelize.FLOAT,
              unique: false,
          },
          peso: {
              allowNull: true,
              type: Sequelize.FLOAT,
              unique: false,
          },
          devImpuesto: {
              allowNull: false,
              type: Sequelize.TEXT,
              unique: false,
          },
          producto:{
            allowNull:true,
            type:Sequelize.STRING
          },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('gc_propuestas_proveedores');
    }
};
