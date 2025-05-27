const express = require('express');
const axios = require('axios')
const router = express.Router();
const CryptoJS = require('crypto-js');
const config = {
  app_id: '2554',
  key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
  key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
  endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};
router
    .route('/:id')
    .post((req, res) => {
        let result = {};
        console.log(req.body);
        try {
          let dataStr = req.body.data;
          let reqMac = req.body.mac;
      
          let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
          console.log('mac =', mac);
      
          // kiểm tra callback hợp lệ (đến từ ZaloPay server)
          if (reqMac !== mac) {
            // callback không hợp lệ
            result.return_code = -1;
            result.return_message = 'mac not equal';
          } else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng ở đây

            try {
  
              let sql = `UPDATE orders SET
                  paid = 1
              WHERE orderId = ${req.params.id}`
  
              connection.query(sql, (err, row) => {
                  if (err) {
                      console.log(err)
                      return;
                  } 
                }
              )
              console.log('Cập nhật đơn hàng thành công.')

            } catch (err) {
                console.log(err)
                return
            }

            result.return_code = 1;
            result.return_message = 'success';
          }

        } catch (ex) {
            
          console.log('lỗi:::' + ex.message);
          result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
          result.return_message = ex.message;
        }
        
        res.json(result);
      });


module.exports = router;
