const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('gc_propuestas_cabeceras', {
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
        cantProveedores: {
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
        fk_direccion: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "clientes_direcciones",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true
        },                             
        nombreCliente: {
            allowNull: true,
            type: Sequelize.TEXT,
            unique: false,
        },
        atencionA: {
            allowNull: true,
            type: Sequelize.TEXT,
            unique: false,
        },
        fk_tipoDeServicio: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "servicios_tipos",
                    schema: "public",
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
        },            
        tipoDeCarga: {
            allowNull: true,
            type: Sequelize.TEXT,
            unique: false,
        },           
        volumenEstimado: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        },
        pesoEstimado: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        },            
        fk_zonaDespacho: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "zonas_tarifarias",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
        },
        direccion: {
            allowNull: true,
            type: Sequelize.STRING,
        },
        fk_formaDePago: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "formas_pago",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
        },
        fechaValidez: {
            allowNull: true,
            type: Sequelize.TEXT,
            unique: false,
        },
        fk_zonaOrigen: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "zonas_tarifarias",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
        },
        fk_zonaAlmacenaje: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "zonas_tarifarias",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
        },
        fk_zonaDestino: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                    tableName: "zonas_tarifarias",
                    schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: true,
            unique: false,
        },            
        factor: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        },              
        cmbPeso: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        },  
        unidadesACobrar: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        },  
        valorUnitarioUsd: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        },                          
        tarifaUsd: {
            allowNull: true,
            type: Sequelize.FLOAT,
            unique: false,
        }, 
	});
};