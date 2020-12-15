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
   await queryInterface.bulkInsert('bancos', [{
    codigo:'',
    nombre: 'Falabella',
    },
    {
      codigo:'',
      nombre: 'Bci',
    },
    {
      codigo:'',
      nombre: 'Scotiabank',
    },
    {
      codigo:'',
      nombre: 'Itaú',
    },
    {
      codigo:'',
      
      nombre: 'Banco Estado',
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('bancos', null, {});
  }
};
