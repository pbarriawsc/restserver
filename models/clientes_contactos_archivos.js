const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes_contactos_archivos', {
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
};
