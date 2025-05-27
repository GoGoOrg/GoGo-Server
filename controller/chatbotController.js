require('dotenv').config();
const axios = require('axios');

exports.ask = async (req, res) => {
    let myTable = `Dữ liệu của tôi bao gồm các bảng sau:
1. brand: brandId (int), name (varchar), created_at (timestampt), updated_at (timestampt), logo (varchar) chứa dữ liệu nhãn hàng
2. category: catid (int), name (varchar), created_at (timestampt), updated_at (timestampt), description (varchar) chứa dữ liệu thể loại
3. component: componentId (int), name (varchar), created_at (timestampt), updated_at (timestampt), description (varchar) chứa dữ liệu thành phần
4. product: proId (int), catId (int), brandId (int), name (varchar), created_at (timestampt), updated_at (timestampt), description (varchar), unit (varchar), guide(text), maintain (text), note (text) chứa dữ liệu sản phẩm
5. product_component: productComponentId (int), productId (int), componentId (int), created_at (timestampt), updated_at (timestampt) chứa dữ liệu trung gian sản phẩm- thành phần
6. product_tag: productTagId (int), productId (int), tagId (int), created_at (timestampt), updated_at (timestampt) chứa dữ liệu trung gian sản phẩm-nhãn dán
7. tag: tagId (int), name(varchar), created_at (timestampt), updated_at(timestampt) chứa dữ liệu nhãn dán
8. type: typeId (int), name(varchar), productId(int), unitPrice(int), quantityInStock(int), created_at (timestampt), updated_at (timestampt) chứa dữ liệu loại sản phẩm (một sản phẩm có bao nhiêu loại)
9. review: reviewId (int), productId (int), accountId (int), content (varchar), star (int), created_at (timestampt), updated_at (timestampt) chứa dữ liệu đánh giá
10. selectedproduct: selectProductId (int), quantitySelected (int), sellingPrice(int), created_at (timestampt), updated_at (timestampt), proId (int), orderId(int), accountId(int), typeId (int), block (tinyInt) (block = 1 có nghĩa là sản phẩm đã được đặt hàng, = 0 là còn đang nằm trong giỏ hàng) chứa dữ liệu các sản phẩm được lưu trong giỏ hàng, lưu ý nhớ loại ra những cái nào bị hủy (nối với orders có cancel = 1)
11. orders: orderId (int), created_at (timestampt), updated_at (timestampt), accountId (int), totalPrice (int), shippingPrice(int), shippingAddress (varchar), shipped(tinyInt), shippedDate(varchar), shipmentTracking (varchar), paid(tinyInt), confirm(tinyInt) - Nếu confirm == 0 là chưa được admin duyệt đơn, =1 là đã duyệt, cancel (int) Nếu cancel == 0 là đơn chưa hủy, =1 là đã hủy. chứa dữ liệu các đơn hàng, lưu ý đừng trả lời mấy đơn đã hủy, paymentType(string) - Phương thức thanh toán, note(string) - Lưu ý khi đặt hàng

Khi nhận được câu hỏi, hãy thực hiện như sau:
- Nếu câu hỏi liên quan đến các yêu cầu truy vấn hay các bảng trên và yêu cầu câu lệnh SQL, hãy trả về câu lệnh SQL ngắn nhất có thể, không cần định dạng.
- Nếu câu hỏi liên quan đến một bảng không nằm trong danh sách trên, hãy trả lời tương tự như "Hệ thống không tồn tại bảng này." nhưng thân thiện hơn bằng Tiếng Việt.
- Nếu câu hỏi không liên quan đến SQL hoặc là một câu hỏi thông thường (ví dụ: "Hello" hay các kiến thức chăm sóc da, vâng vâng), hãy trả lời như một Gemini thông thường nhưng không cần định dạng bằng Tiếng Việt.
`

    const userQuery = myTable + req.body.query;

    var result

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + process.env.GEMINI_KEY,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: userQuery
                            }
                        ]
                    }
                ]
            }
        );

        var query = response.data.candidates[0].content.parts[0].text.replaceAll("```", "").replaceAll("sql", "");
        connection.query(query, async (err, rows) => {

            if (err)
                res.status(200).json({
                    status: 'success1',
                    data: {
                        message: query,
                    },
                    err: err
                });
            else {
                result = new Array(rows)
                let userQuery1 = `Chỉ trả lời cho câu hỏi "${req.body.query}" bằng dữ liệu sau ${JSON.stringify(result)}. không diễn giải thêm.`
                console.log(result)
        
                let response1 = await axios.post(
                    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBK11F7QsKhgE-m5wi6WFbQjJzBud7SvNA',
                    {
                        contents: [
                            {
                                parts: [
                                    {
                                        text: userQuery1
                                    }
                                ]
                            }
                        ]
                    }
                );
        
                res.status(200).json({
                    status: 'success',
                    data: {
                        message: response1.data.candidates[0].content.parts[0].text,
                    },
                });
            }
        });

       
    } catch (error) {
        console.error('Error:', error);
    }
};
