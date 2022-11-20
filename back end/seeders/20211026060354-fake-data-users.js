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
    await queryInterface.bulkInsert('users', [
      {
        name: 'Trương Ngọc Trung Anh',
        dateOfBirth: '1995-10-10',
        email: 'anh.truong5795@hcmut.edu.vn',
        role: "client",
        password: '123456',
        phone_no: '0908369635',
        address: '358 ngo gia tu',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "google"
      },
      {
        name: 'Mike',
        dateOfBirth: '1995-10-10',
        email: 'trunganh2@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0908769135',
        address: '358 ngo gia tu 2',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Samatha',
        dateOfBirth: '1995-10-10',
        email: 'trunganh3@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0908763135',
        address: '358 ngo gia tu 3',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'John Nadal',
        dateOfBirth: '1995-10-10',
        email: 'trunganh4@gmail.com',
        role: "admin",
        password: '123456',
        phone_no: '0908769631',
        address: '358 ngo gia tu 5',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'David Rechard',
        dateOfBirth: '1995-10-10',
        email: 'david998999@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0988769635',
        address: '358 ngo gia tu 6',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Mecheal Maletino',
        dateOfBirth: '1995-10-10',
        email: 'maletino6@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0908769639',
        address: '358 ngo gia tu 7',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Jenifer Loferin',
        dateOfBirth: '1995-11-10',
        email: 'trunganh99@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0908769689',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'David Valid',
        dateOfBirth: '1995-11-10',
        email: 'trunganh991@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0908764631',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Hazaki Kamalia',
        dateOfBirth: '1995-11-10',
        email: 'trunganh19@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0901769631',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Rolio Fadentino',
        dateOfBirth: '1995-11-10',
        email: 'trunganh92@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0908709631',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Carlo Hachika',
        dateOfBirth: '1995-11-10',
        email: 'hachikacarlo@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0933939009',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Elon Musk',
        dateOfBirth: '1995-11-10',
        email: 'elonmusk112@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0933939099',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Machiata Jupiter',
        dateOfBirth: '1995-11-10',
        email: 'machiatajupiter@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0933931099',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Kelvin Zance',
        dateOfBirth: '1995-11-10',
        email: 'kelvinzance@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0993939199',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Stephen Grisham',
        dateOfBirth: '1995-11-10',
        email: 'stephengrisham@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0943939199',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Noran Roberts',
        dateOfBirth: '1995-11-12',
        email: 'noranroberts@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0933739199',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Agatha Christie',
        dateOfBirth: '1995-11-10',
        email: 'agatha3390@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0933939199',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Barbara Cartland',
        dateOfBirth: '1994-11-10',
        email: 'cartland123@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0933937199',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'James Patterson',
        dateOfBirth: '1994-12-10',
        email: 'james3089@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0993935199',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'David Baldacci',
        dateOfBirth: '1994-12-08',
        email: 'baldacci9909@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0913935123',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Christine Feehan',
        dateOfBirth: '1994-12-08',
        email: 'feehan3090@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0913935723',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Riz Ahmed',
        dateOfBirth: '1994-12-08',
        email: 'rizahmed11222@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0913945823',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Michelle Williams',
        dateOfBirth: '1994-12-08',
        email: 'williams9909@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0911945923',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Olivia Cooke',
        dateOfBirth: '1994-12-08',
        email: 'cookeolivia11@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0911995923',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Emma Stone',
        dateOfBirth: '1998-12-08',
        email: 'emmastone990@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0911995023',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Kate Upton',
        dateOfBirth: '1998-12-12',
        email: 'kate9909@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0911245023',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Abigail Breslin',
        dateOfBirth: '1998-12-12',
        email: 'abigailbreslin@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0922245023',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Charlize Theron',
        dateOfBirth: '1995-12-8',
        email: 'charlizetheron3309@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0922245123',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Scarlett Johansson',
        dateOfBirth: '1996-12-8',
        email: 'johansson1996@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0922275123',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
      },
      {
        name: 'Margot Robbie',
        dateOfBirth: '1999-12-8',
        email: 'margotrobbie221@gmail.com',
        role: "client",
        password: '123456',
        phone_no: '0922275126',
        address: '358 ngo gia tu 4',
        img: null,
        active: "active",
        verifyCode: 123456,
        authType: "local"
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
    await queryInterface.bulkDelete('users', null, {})
  }
};