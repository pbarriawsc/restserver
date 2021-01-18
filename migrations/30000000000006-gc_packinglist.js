'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('gc_packinglist', {
            pack_id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            pack_estado: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            pack_ano: {
                allowNull: false,
                type: Sequelize.TEXT
            },   
            pack_mes: {
                allowNull: false,
                type: Sequelize.TEXT
            },     
            pack_dia: {
                allowNull: false,
                type: Sequelize.TEXT
            },                                    
            pack_fk_proveedor: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "gc_proveedores",
                        schema: "public"
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: false
            },
            pack_fk_contacto: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "gc_registrocontactos",
                        schema: "public"
                    },
                    key: "id",
                    onDelete: "RESTRICT",
                    onUpdate: "RESTRICT",
                },
                allowNull: false
            },
            pack_hsCode: {
                allowNull: false,
                type: Sequelize.TEXT
            }, 
            pack_descripcion: {
                allowNull: false,
                type: Sequelize.TEXT
            }, 
            pack_unidad: {
                allowNull: false,
                type: Sequelize.FLOAT
            }, 
            pack_bultos: {
                allowNull: false,
                type: Sequelize.FLOAT
            }, 
            pack_unidadBulto: {
                allowNull: false,
                type: Sequelize.FLOAT
            },              
            pack_precioUnitario: {
                allowNull: false,
                type: Sequelize.FLOAT
            },  
            pack_cmbBulto: {
                allowNull: false,
                type: Sequelize.FLOAT
            },  
            pack_pesoBulto: {
                allowNull: false,
                type: Sequelize.FLOAT
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
        await queryInterface.dropTable('gc_packinglist');
    }
};