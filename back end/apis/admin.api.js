const adminApi = require('express').Router();
const adminController = require('../controllers/admin.controller');
const passportAuth = require('../middleware/passport.middleware');

adminApi.post('/login', adminController.adminLogin)
// api: thêm 1 sản phẩm
adminApi.post('/products/add', passportAuth.jwtAuthentication, adminController.addProduct);

// api: cập nhật 1 sản phẩm
adminApi.put('/products/update', passportAuth.jwtAuthentication, adminController.updateProduct);

adminApi.get('/customer/by', passportAuth.jwtAuthentication, adminController.getCustomerListByValue);

// // api: xoá 1 người dùng
adminApi.delete('/customer/del', passportAuth.jwtAuthentication, adminController.delCustomer);
//api: mở khóa người dùng
adminApi.put('/customer/release', passportAuth.jwtAuthentication, adminController.releaseCustomer);


// api: lấy danh sách đơn hàng
adminApi.get('/order', passportAuth.jwtAuthentication, adminController.getOrderList);
adminApi.get('/order/by', passportAuth.jwtAuthentication, adminController.getOrderListByValue);

// api: cập nhật trạng thái đơn hàng
adminApi.post('/order', passportAuth.jwtAuthentication, adminController.postUpdateOrderStatus);
adminApi.put('/update-num-contact', passportAuth.jwtAuthentication, adminController.updateNumOfContact);
/////////////////
adminApi.get('/product', passportAuth.jwtAuthentication, adminController.getProductDetailsByAdmin);
adminApi.get('/product-search-by-name', passportAuth.jwtAuthentication, adminController.adminSearchProduct)
adminApi.post('/voucher', passportAuth.jwtAuthentication, adminController.addNewVoucher)
adminApi.get('/voucher', passportAuth.jwtAuthentication, adminController.getAllVouchers)
adminApi.get('/voucher/by', passportAuth.jwtAuthentication, adminController.getVoucherListByValue)
adminApi.get('/voucher/type', adminController.getVoucherByCategory)
adminApi.delete('/voucher', passportAuth.jwtAuthentication, adminController.deleteVoucher)
adminApi.put('/voucher', passportAuth.jwtAuthentication, adminController.updateVoucherDetails)


adminApi.get('/recombeetoken', passportAuth.jwtAuthentication, adminController.getRecombeeToken)
// adminApi.get('/updatetest', adminController.updateTest)
// adminApi.get('/test',adminController.calculateCancellationRate)
// const { Book } = require('../models');
// let data = require('../initdata/diadanhdulich.json')
// // data = JSON.parse(data)
// adminApi.get('/importJsonfile', async (req, res) => {
//     try {
//         for (let i = 0; i < data.length; i++) {
//             let authors = null;
//             if (data[i].authors) {
//                 let authorList = data[i].authors.map(item => item.name)
//                 authors = authorList.join(', ')

//             }
//             // console.log(authors);
//             await Book.create({
//                 ...data[i],
//                 price: Math.floor(data[i].price / 1000) * 1000,
//                 author: authors,
//                 category: 3
//             })
//             // if (i === 0) break
//         }
//         res.status(200).send("OK")
//     } catch (e) {
//         console.log(e)
//     }
// });
// var recombee = require('recombee-api-client');
// var rqs = recombee.requests;
// var client = new recombee.ApiClient('bookstore-dev', 'jPMy6xaupM5QUE4K5I4EkWkBCHE6lMYylQ65sWGgezDe58Bvm40iuLUkwn7PAb3p', { region: 'ap-se' });

// adminApi.get('/recombee', async (req, res, next) => {
//     let result = await Book.findAll();


//     let requests = [];
//     // console.log(result[0].price);
//     for (let i = 0; i < result.length; i++) {
//         requests.push(new rqs.SetItemValues(
//             result[i].bookId,
//             {
//                 price:result[i].price,
//                 instock:result[i].instock,
//                 discount:result[i].discount,
//                 img:result[i].img,
//                 author: result[i].author,
//                 bookId: result[i].bookId,
//                 category: result[i].category,
//                 comment: result[i].comment,
//                 description: result[i].description,
//                 short_description: result[i].short_description,
//                 publicOfYear: result[i].publicOfYear,
//                 publisher: result[i].publisher,
//                 stars: result[i].stars,
//                 status: result[i].status,
//                 title: result[i].title,
//             }
//             , { 'cascadeCreate': true }))
//         // if (i === 1) break
//     }
//     console.log(requests);
//     await client.send(new rqs.Batch(requests));
//     res.status(200).send("OK")
//     // client.send(new rqs.SetItemValues(1,
//     //     // values
//     //     {
//     //         author: result[0].author,
//     //         bookId: result[0].bookId,
//     //         category: result[0].category,
//     //         comment: result[0].comment,
//     //         description: result[0].description,
//     //         short_description: result[0].short_description,
//     //         publicOfYear: result[0].publicOfYear,
//     //         publisher: result[0].publisher,
//     //         stars: result[0].stars,
//     //         status: result[0].status,
//     //         title: result[0].title,
//     //     },
//     //     // optional parameters
//     //     {
//     //         cascadeCreate: true
//     //     }
//     // ),
//     //     (err, response) => {
//     //         //...
//     //         if (err) {
//     //             console.log(err);
//     //             next({})
//     //         } else {
//     //             res.status(200).send("OK")
//     //         }
//     //     }
//     // );
// })
module.exports = adminApi;
