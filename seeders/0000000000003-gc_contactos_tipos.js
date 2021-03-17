'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
  {

    await queryInterface.bulkInsert('gc_contactos_tipos', [

      { nombre:'CORREO' },
      { nombre:'TELEFONO' },
      { nombre:'INSTAGRAM' },
      { nombre:'WHATSAPP' },
      { nombre:'FACEBOOK' },
      { nombre:'LINKEDIN' },
      { nombre:'REFERIDO' },

    ], {});

  },

  down: async (queryInterface, Sequelize) =>
  {
     await queryInterface.bulkDelete('gc_contactos_tipos', null, {});
  }
};
