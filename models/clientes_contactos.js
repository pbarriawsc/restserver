const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes_direcciones', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        estado: {
            allowNull: true,
            type: Sequelize.BOOLEAN,
            unique: false,
        },
        nombre: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        telefono_1: {
            type: Sequelize.STRING
        },
        telefono_2: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },  
        cargo: {
            type: Sequelize.STRING
        },                
        fk_tipo: {
            type: Sequelize.INTEGER,
            references: {
                model: {
                        tableName: "contacto_tipo",
                        schema: "public"
                },
                key: "id",
                onDelete: "RESTRICT",
                onUpdate: "RESTRICT",
            },
            allowNull: false
        },
        comentario: {
            type: Sequelize.STRING
        },
	});
};
