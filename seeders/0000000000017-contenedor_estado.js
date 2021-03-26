'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('contenedor_estado', [{
       nombre: 'Creado',
       estado:true
    },
    {
      nombre: 'Reservado',
      estado:true
    },
    {
      nombre: 'Carga Parcial',
      estado:true
    },
    {
      nombre: 'Carga Completa',
      estado:true
    },
    {
      nombre: 'Asignada a Nave',
      estado:true
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('contenedor_estado', null, {});
  }
};
