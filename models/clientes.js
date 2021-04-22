const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('clientes', {
		id: {
			allowNull: true,
			autoIncrement: true,
			primaryKey: true,
			type: Sequelize.INTEGER
        },
        rut: {
            allowNull: true,
            type: Sequelize.STRING,
            unique: false,
        },
				estado: {
            allowNull: false,
            type: Sequelize.BOOLEAN,
            unique: false,
        },
        nombre: {
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
		},{
				initialAutoIncrement: 2500
		});
};
