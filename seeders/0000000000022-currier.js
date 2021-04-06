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
    await queryInterface.bulkInsert('currier', [
      {
       nombre: 'ZTO',
       nombre_chino:'中通快递',
       web:'https://www.zto.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'ZTO56',
       nombre_chino:'中通快运',
       web:'http://www.zto56.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'YTO',
       nombre_chino:'圆通速递',
       web:'https://www.yto.net.cn/',
       link:null,
       estado:1
      },
      {
       nombre: 'YUNDAEX',
       nombre_chino:'韵达速递',
       web:'http://www.yundaex.com/cn/index.php',
       link:null,
       estado:1
      },
      {
       nombre: 'STO',
       nombre_chino:'申通快递',
       web:'http://www.sto.cn/',
       link:null,
       estado:1
      },
      {
       nombre: '800BESTEX',
       nombre_chino:'百世快递',
       web:'http://www.800bestex.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'SF-EXPRESS',
       nombre_chino:'顺丰速运',
       web:'https://www.sf-express.com/cn/sc/',
       link:null,
       estado:1
      },
      {
       nombre: 'YIMIDIDA',
       nombre_chino:'壹米滴答',
       web:'https://www.yimidida.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'ANE56',
       nombre_chino:'安能物流',
       web:'http://www.ane56.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'XF-EXPRESS',
       nombre_chino:'信丰物流',
       web:'http://www.xf-express.com.cn/',
       link:null,
       estado:1
      },
      {
       nombre: 'JDL',
       nombre_chino:'京东物流',
       web:'https://www.jdl.cn/',
       link:null,
       estado:1
      },
      {
       nombre: 'ZTKY',
       nombre_chino:'中铁物流',
       web:'http://www.ztky.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'SUT56',
       nombre_chino:'速通物流',
       web:'https://www.sut56.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'KJKD',
       nombre_chino:'快捷快递',
       web:'www.kjkd.com',
       link:null,
       estado:1
      },
      {
       nombre: 'KY-EXPRESS',
       nombre_chino:'跨越速运',
       web:'https://www.ky-express.com/',
       link:null,
       estado:1
      },
      {
       nombre: 'EMS',
       nombre_chino:'邮政快递',
       web:'https://www.ems.com.cn/',
       link:null,
       estado:1
      },
      {
       nombre: 'DEPPON',
       nombre_chino:'德邦快递',
       web:'https://www.deppon.com/index',
       link:null,
       estado:1
      },
      {
       nombre: 'UCE',
       nombre_chino:'优速物流',
       web:'https://www.uce.cn/',
       link:null,
       estado:1
      },
      {
       nombre: 'HOAU',
       nombre_chino:'天地华宇',
       web:'www.hoau.net',
       link:null,
       estado:1
      },
      {
       nombre: 'OTHER',
       nombre_chino:'其它',
       web:null,
       link:null,
       estado:1
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
      await queryInterface.bulkDelete('currier', null, {});
  }
};
