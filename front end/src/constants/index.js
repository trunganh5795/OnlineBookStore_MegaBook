import helpers from "../helpers";

// phí vận chuyển tính theo vùng
let SHIPPING_BASE_PRICE = [
  15000, // SG
  35000, // HN
  30000,
  20000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
  25000,
]
// gender options
const GENDER_OPTIONS = [
  { value: "male", label: 'Nam' },
  { value: "female", label: 'Nữ' },
];
// hình thức giao hàng
// const TRANSPORT_METHOD_OPTIONS = [
//   { value: 0, label: 'Giao hàng tiêu chuẩn', price: 0 },
//   { value: 1, label: 'Giao hàng tiết kiệm', price: 0 },
//   { value: 2, label: 'Giao hàng nhanh', price: 0 },
// ];
const CATEGORIES_IMAGE =[
  {title:'Kinh Tế', url:'https://res.cloudinary.com/dsa-company/image/upload/v1660226326/category_image/bussiness_ax0ezk.jpg',to:'/filter/1'},
  {title:'Văn Học',url:'https://res.cloudinary.com/dsa-company/image/upload/v1660226359/category_image/literary_baqkzg.jpg',to:'/filter/2'},
  {title:'Địa Danh - Du Lịch',url:'https://res.cloudinary.com/dsa-company/image/upload/v1660226403/category_image/travel_ks0qoj.jpg',to:'/filter/3'},
  {title:'Giáo Dục',url:'https://res.cloudinary.com/dsa-company/image/upload/v1660226326/category_image/math_oqrysi.jpg',to:'/filter/4'},
  {title:'Thể Thao - Sức Khỏe',url:'https://res.cloudinary.com/dsa-company/image/upload/v1660226325/category_image/fitness_sqlqvv.jpg',to:'/filter/5'},
  {title:"Truyện", url:"https://res.cloudinary.com/dsa-company/image/upload/v1660226326/category_image/ecomic_b2nzp7.jpg",to:'/filter/6'},
  {title:"Tâm Lý - Giới Tính", url:"https://res.cloudinary.com/dsa-company/image/upload/v1660226326/category_image/gender_x3zkss.png",to:'/filter/7'}
]
const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/login/forgot-pw',
  // PRODUCT: '/product/:productId/:rcm?/:index?/:type?',
  PRODUCT: '/product/:productId',
  NOT_FOUND: '/not-found',
  ADMIN: '/admin',
  ACCOUNT: '/account',
  CART: '/cart',
  SEARCH: '/search',
  FILTER: '/filter/:type',
  // ACCOUNT: '/account',
  PAYMENT: '/payment',
  QRcodeDetails: '/admin/qrcodedetails/:id'
};

const PROVINCE = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Bình Dương',
  'Đồng Nai',
  'Khánh Hòa',
  'Hải Phòng',
  'Long An',
  'Quảng Nam',
  'Bà Rịa Vũng Tàu',
  'Đắk Lắk',
  'Cần Thơ',
  'Bình Thuận',
  'Lâm Đồng',
  'Thừa Thiên Huế',
  'Kiên Giang',
  'Bắc Ninh',
  'Quảng Ninh',
  'Thanh Hóa',
  'Nghệ An',
  'Hải Dương',
  'Gia Lai',
  'Bình Phước',
  'Hưng Yên',
  'Bình Định',
  'Tiền Giang',
  'Thái Bình',
  'Bắc Giang',
  'Hòa Bình',
  'An Giang',
  'Vĩnh Phúc',
  'Tây Ninh',
  'Thái Nguyên',
  'Lào Cai',
  'Nam Định',
  'Quảng Ngãi',
  'Bến Tre',
  'Đắk Nông',
  'Cà Mau',
  'Vĩnh Long',
  'Ninh Bình',
  'Phú Thọ',
  'Ninh Thuận',
  'Phú Yên',
  'Hà Nam',
  'Hà Tĩnh',
  'Đồng Tháp',
  'Sóc Trăng',
  'Kon Tum',
  'Quảng Bình',
  'Quảng Trị',
  'Trà Vinh',
  'Hậu Giang',
  'Sơn La',
  'Bạc Liêu',
  'Yên Bái',
  'Tuyên Quang',
  'Điện Biên',
  'Lai Châu',
  'Lạng Sơn',
  'Hà Giang',
  'Bắc Kạn',
  'Cao Bằng',

]

const CATEGORIES = [
  {
    title: "Sách Kinh Tế",
    value: 1
  },
  {
    title: "Sách Văn Học",
    value: 2
  },
  {
    title: "Đại Danh - Du Lịch",
    value: 3
  },
  {
    title: "Giáo Dục",
    value: 4
  },
  {
    title: "Thể Thao - Sức Khỏe",
    value: 5
  },
  {
    title: "Truyện",
    value: 6
  },
  {
    title: "Tâm Lý - Giới Tính",
    value: 7
  },
]
const BAR_CHART_OPTION = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: true,
  },
  // stacked: false,
  plugins: {
    legend: {
      position: 'top',
      display: true
    },
    title: {
      display: true,
      text: 'Biểu đồ Histogram phân bổ đơn hàng theo giá trị',
      font: {
        size: '20px'
      }
    },
    datalabels: {
      display: false, //default: true
      anchor: 'end',
      align: 'end',
      formatter: Math.round,
      font: {
        weight: 'bold',
        size: '18px'
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          return "Số đơn :" + ctx.raw.y
        },
        title: (tooltipItem) => {
          let text = "";
          if (tooltipItem[0]) {
            if (tooltipItem[0].parsed.x >= 1000) {
              text = "> 1000K VND"
            } else {
              text = `Giá trị: ${+tooltipItem[0].label - 50}K - ${+tooltipItem[0].label + 50}K VND`
            }
          } else {
            text = "undefined"
          }
          
          return text;
        }
      }

    }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Số đơn hàng',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
      min: 0,
      // max: 2200,
      ticks: {
        // forces step size to be 50 units
        stepSize: 50
      }
      // position: 'right',
    },
    // y1: {
    //     title: {
    //         display: true,
    //         text: 'Doanh thu ( VND )',
    //         color: '#000',
    //         font: {
    //             // family: 'Comic Sans MS',
    //             size: 20,
    //             // weight: 'bold',
    //             lineHeight: 1.2,
    //         },
    //         padding: { top: 20, left: 0, right: 0, bottom: 0 }
    //     },
    //     min: 0,
    //     max: 300,
    //     position: 'right',
    //     grid: {
    //         display: false
    //     }
    // }
    // ,
    x: {
      title: {
        display: true,
        text: 'Giá trị x1000 VND',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
      // type: 'time',
      // time: {
      //     parser: 'DD/MM/YYYY',
      //     unit: 'month',
      //     displayFormats: {
      //         month: 'MM / YY'
      //     },
      //     tooltipFormat: 'DD-MM-YYYY'
      // }
      // start
      beginAtZero: true,
      type: 'linear',
      ticks: {
        stepSize: 100,
        callback: function (value, index, values) {
          let text = value > 1000 ? '> 1000' : value
          return text;
        }
      },
      offset: false,
      grid: {
        offset: false
      },
    },
  }
};
const LINE_CHART_OPTION = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: true,
  },
  // stacked: false,
  plugins: {
    legend: {
      position: 'top',
      display: true
    },
    title: {
      display: true,
      text: 'Thống kê đơn hàng',
      font: {
        size: '20px'
      }
    },
    datalabels: {
      display: false, //default: true
      anchor: 'end',
      align: 'end',
      formatter: Math.round,
      font: {
        weight: 'bold',
        size: '18px'
      }
    },
    tooltip: {
      callbacks: {
        filter: ctx => ctx.datasetIndex == 0,
        label: (tooltipItems) => {
          
          var text = tooltipItems.datasetIndex === 1 ? 'Doanh thu : ' + helpers.formatProductPrice(tooltipItems.raw) : 'Số đơn : ' + tooltipItems.raw
          return text;
        },
      }
    }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Số đơn hàng',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },

      },
      min: 0,
      // max: 200,
      // position: 'right',
      // grid: {
      //   display: false
      // }
      // ticks: {
      //   stepSize: 1
      // }
    },
    y1: {
      // display:false,  ẩn trục y1
      title: {
        display: true,
        text: 'Doanh thu',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
      min: 0,
      // max: 300,
      position: 'right',
      grid: {
        display: false
      }
    },
    x: {
      title: {
        display: true,
        // text: 'Month',
        // color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
      type: 'time',
      time: {
        parser: 'YYYY/MM/DD',
        unit: 'day',
        displayFormats: {
          month: 'MM / YY'
        },
        tooltipFormat: 'DD-MM-YYYY'
      },
      // scaleLabel: {
      //     labelString: 'Timestamp'
      // }
    },
  },


};
const LINE_CHART_OPTION_QRCODE_PAGE = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: true,
  },
  // stacked: false,
  plugins: {
    legend: {
      position: 'top',
      display: true
    },
    title: {
      display: true,
      text: 'Thống kê lượng bán',
      font: {
        size: '20px'
      }
    },
    datalabels: {
      display: false, //default: true
      anchor: 'end',
      align: 'end',
      formatter: Math.round,
      font: {
        weight: 'bold',
        size: '18px'
      }
    },
    // tooltip: {
    //   callbacks: {
    //     filter: ctx => ctx.datasetIndex == 0,
    //     label: (tooltipItems) => {
    //       
    //       var text = tooltipItems.datasetIndex === 1 ? 'Doanh thu : ' + helpers.formatProductPrice(tooltipItems.raw) : 'Số đơn : ' + tooltipItems.raw
    //       return text;
    //     },
    //   }
    // }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Số sản phẩm',
        color: '#000',
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          // weight: 'bold',
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 },

      },
      min: 0,
      // max: 200,
      // position: 'right',
      // grid: {
      //   display: false
      // }
      // ticks: {
      //   stepSize: 5
      // }
    },
    x: {
      title: {
        display: true,
        font: {
          // family: 'Comic Sans MS',
          size: 20,
          lineHeight: 1.2,
        },
        padding: { top: 20, left: 0, right: 0, bottom: 0 }
      },
      type: 'time',
      time: {
        parser: 'YYYY/MM/DD',
        unit: 'day',
        displayFormats: {
          month: 'MM / YY'
        },
        tooltipFormat: 'DD-MM-YYYY'
      },
      // scaleLabel: {
      //     labelString: 'Timestamp'
      // }
    },
  },
};
const FILTER_OPTION_LIST = [
  {
    key: 0,
    root: `/filter/0`,
  },
  {
    key: 1,
    root: `/filter/1`,
  },
  {
    key: 4,
    root: `/filter/4`,
  },
  {
    key: 9,
    root: `/filter/9`,
  },
  {
    key: 2,
    root: `/filter/2`,
  },
  {
    key: 5,
    root: `/filter/5`,
  },
  {
    key: 10,
    root: `/filter/10`,
  },
  {
    key: 8,
    root: `/filter/8`,
  }
];
export default {
  REFRESH_TOKEN_KEY: 'refresh_token',
  ACCESS_TOKEN_KEY: 'ttb_atk',
  MAX_VERIFY_CODE: 6,
  GENDER_OPTIONS,
  // tuổi nhỏ nhất sử dụng app
  MIN_AGE: 8,
  // thời gian delay khi chuyển trang
  // DELAY_TIME: 750,
  // số lần đăng nhập sai tối đa
  MAX_FAILED_LOGIN_TIMES: 5,
  ROUTES,
  REFRESH_TOKEN: 'refresh_token',
  // PRODUCT_TYPES,
  // tỉ lệ nén ảnh, và nén png 2MB
  COMPRESSION_RADIO: 0.6,
  COMPRESSION_RADIO_PNG: 2000000,
  // số lượng sản phẩm liên quan tối đa cần lấy
  MAX_RELATED_PRODUCTS: 8,
  // Avatar mặc định của user
  DEFAULT_USER_AVT:
    'https://res.cloudinary.com/dsa-company/image/upload/v1660443786/user_x8nhqm.png',
  // Số comment sản phẩm trên trang
  COMMENT_PER_PAGE: 5,
  // độ dài tối đa của cmt
  MAX_LEN_COMMENT: 1000,
  // key danh sách giỏ hàng
  CARTS: 'carts',
  CATEGORIES,
  SHIPPING_BASE_PRICE,
  PROVINCE,
  BAR_CHART_OPTION,
  LINE_CHART_OPTION,
  LINE_CHART_OPTION_QRCODE_PAGE,
  FILTER_OPTION_LIST,
  CATEGORIES_IMAGE
};
