const { Sequelize } = require('sequelize');

module.exports = (sequelize,Sequelize) => {
	sequelize.define('gc_propuestas_cabeceras', {
		id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
		estado: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        servicio: {
            type: Sequelize.STRING
        },
        tipoCarga: {
            type: Sequelize.STRING
        },
        volumenEstimado: {
            type: Sequelize.FLOAT
        },
        pesoEstimado: {
            type: Sequelize.FLOAT
        },
        nombreCliente: {
            type: Sequelize.TEXT
        },
        atencionA: {
            type: Sequelize.TEXT
        },
        direccionDespacho: {
            type: Sequelize.STRING
        },                
        fk_contacto: {
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
};