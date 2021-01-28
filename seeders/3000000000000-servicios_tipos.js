'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => 
  {
  
    await queryInterface.bulkInsert('servicios_tipos', [{
       nombre: 'IMPORTACIÓN LCL',
       estado:true,
       fechaCreacion:'2021-01-01 00:00:00-03',
       fechaActualizacion:'2021-01-01 00:00:00-03',
    },
    ], {});
    
  },

  down: async (queryInterface, Sequelize) => 
  {

     await queryInterface.bulkDelete('servicios_tipos', null, {});

  }
};
