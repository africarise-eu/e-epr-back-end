'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   const fromports = [
     {
       portname: 'Port of Maputo',
       province: 'Maputo City',
       townname: 'Maputo City',
       lat: '25.58',
       lng: '32.33',
       code: 'MZMPM'
      },
      {
        portname: 'Port of Matola',
        province: 'Maputo Province',
        townname: 'Matola',
        lat: '25.57',
        lng: '32.29',
        code: 'MZMAT'
       },
       {
        portname: 'Port of Inhambane',
        province: 'Inhambane Province',
        townname: 'Inhambane',
        lat: '23.52',
        lng: '35.22',
        code: 'MZINH'
       },
       {
        portname: 'Port of Maxixe',
        province: 'Inhambane Province',
        townname: 'Maxixe',
        lat: '23.51',
        lng: '35.21',
        code: 'MZMAX'
       },
       {
        portname: 'Port of Beira',
        province: 'Sofala Province',
        townname: 'Beira',
        lat: '19.48',
        lng: '34.49',
        code: 'MZBEW'
       },
       {
        portname: 'Port of Nacala',
        province: 'Nampula Province',
        townname: 'Nacala',
        lat: '14.32',
        lng: '40.40',
        code: 'MZMNC'
       },
       {
        portname: 'Port of Pebane',
        province: 'Zambezia Province',
        townname: 'Pebane',
        lat: '17.15',
        lng: '38.07',
        code: 'MZPEB'
       },
       {
        portname: 'Port of Mocambique',
        province: 'Nampula Province',
        townname: 'Island of Mocambique',
        lat: '15.02',
        lng: '40.43',
        code: 'MZMZQ'
       },
       {
        portname: 'Port of Moma',
        province: 'Nampula Province',
        townname: 'Moma District',
        lat: '16.37',
        lng: '39.43',
        code: 'MZMPM'
       },
       {
        portname: 'Port of Quelimane',
        province: 'Zambezia Province',
        townname: 'Quelimane',
        lat: '17.53',
        lng: '36.53',
        code: 'MZUEL'
       }
   ];
   const portArray = fromports.map((elem) => {
    return {
        portname: elem.portname,
        lat: elem.lat,
        lng: elem.lng,
        province: elem.province,
        townname: elem.townname,
        code: elem.code,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
});
await queryInterface.bulkInsert('FromPorts', portArray);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      'FromPorts', null, 
      {}
  );
  }
};
