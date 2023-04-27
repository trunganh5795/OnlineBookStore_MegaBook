"use strict";

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
    await queryInterface.bulkInsert(
      "provinces",
      [
        { name: "Hồ Chí Minh", code: "SG" },
        { name: "Hà Nội", code: "HN" },
        { name: "Đà Nẵng", code: "DDN" },
        { name: "Bình Dương", code: "BD" },
        { name: "Đồng Nai", code: "DNA" },
        { name: "Khánh Hòa", code: "KH" },
        { name: "Hải Phòng", code: "HP" },
        { name: "Long An", code: "LA" },
        { name: "Quảng Nam", code: "QNA" },
        { name: "Bà Rịa Vũng Tàu", code: "VT" },
        { name: "Đắk Lắk", code: "DDL" },
        { name: "Cần Thơ", code: "CT" },
        { name: "Bình Thuận  ", code: "BTH" },
        { name: "Lâm Đồng", code: "LDD" },
        { name: "Thừa Thiên Huế", code: "TTH" },
        { name: "Kiên Giang", code: "KG" },
        { name: "Bắc Ninh", code: "BN" },
        { name: "Quảng Ninh", code: "QNI" },
        { name: "Thanh Hóa", code: "TH" },
        { name: "Nghệ An", code: "NA" },
        { name: "Hải Dương", code: "HD" },
        { name: "Gia Lai", code: "GL" },
        { name: "Bình Phước", code: "BP" },
        { name: "Hưng Yên", code: "HY" },
        { name: "Bình Định", code: "BDD" },
        { name: "Tiền Giang", code: "TG" },
        { name: "Thái Bình", code: "TB" },
        { name: "Bắc Giang", code: "BG" },
        { name: "Hòa Bình", code: "HB" },
        { name: "An Giang", code: "AG" },
        { name: "Vĩnh Phúc", code: "VP" },
        { name: "Tây Ninh", code: "TNI" },
        { name: "Thái Nguyên", code: "TN" },
        { name: "Lào Cai", code: "LCA" },
        { name: "Nam Định", code: "NDD" },
        { name: "Quảng Ngãi", code: "QNG" },
        { name: "Bến Tre", code: "BTR" },
        { name: "Đắk Nông", code: "DNO" },
        { name: "Cà Mau", code: "CM" },
        { name: "Vĩnh Long", code: "VL" },
        { name: "Ninh Bình", code: "NB" },
        { name: "Phú Thọ", code: "PT" },
        { name: "Ninh Thuận", code: "NT" },
        { name: "Phú Yên", code: "PY" },
        { name: "Hà Nam", code: "HNA" },
        { name: "Hà Tĩnh", code: "HT" },
        { name: "Đồng Tháp", code: "DDT" },
        { name: "Sóc Trăng", code: "ST" },
        { name: "Kon Tum", code: "KT" },
        { name: "Quảng Bình", code: "QB" },
        { name: "Quảng Trị", code: "QT" },
        { name: "Trà Vinh", code: "TV" },
        { name: "Hậu Giang", code: "HGI" },
        { name: "Sơn La", code: "SL" },
        { name: "Bạc Liêu", code: "BL" },
        { name: "Yên Bái", code: "YB" },
        { name: "Tuyên Quang", code: "TQ" },
        { name: "Điện Biên", code: "DDB" },
        { name: "Lai Châu", code: "LCH" },
        { name: "Lạng Sơn", code: "LS" },
        { name: "Hà Giang", code: "HG" },
        { name: "Bắc Kạn", code: "BK" },
        { name: "Cao Bằng", code: "CB" },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("provinces", null, {});
  },
};
