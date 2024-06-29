const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const axios = require('axios');

const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({
    extended: false
 }));
 
app.use(bodyParser.json());
 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", function(req, res) {
    res.render("homePage");
});

app.post('/sendMail', async function(req, res) {
    const { fullName, phone, address, job } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'toannn21@gmail.com', // Thay thế bằng email của bạn
            pass: 'tgyi hfet pcxd bmij'   // Thay thế bằng mật khẩu của bạn hoặc app-specific password nếu bạn bật 2FA
        }
    });

    let mailOptions = {
        from: 'toannn21@gmail.com',    // Thay thế bằng email của bạn
        to: 'hocphodatviet@gmail.com',
        subject: 'HỌC VIÊN MỚI',
        text: 'Thông tin học viên mới.', // Nội dung email dạng text
        html: `
            <p>Thông tin học viên mới</p>
            <p><strong>Số điện thoại:</strong></p>
            <p>${phone}</p>
            <p><strong>Họ và Tên:</strong></p>
            <p>${fullName}</p>
            <p><strong>Địa chỉ:</strong></p>
            <p>${address}</p>
            <p><strong>Công việc hiện tại:</strong></p>
            <p>${job}</p>
        ` // Nội dung email dạng HTML
    };

    try {
        // Gửi email
        await transporter.sendMail(mailOptions);

        // Gửi yêu cầu POST đến SheetDB
        const sheetDBResponse = await axios.post('https://sheetdb.io/api/v1/l47amgls5m33s', {
            fullName: fullName,
            phone: phone,
            address: address,
            job: job
        });

        console.log('Data sent to SheetDB:', sheetDBResponse.data);
        res.render("acceptCourse");
    } catch (error) {
        console.error('Error:', error);
        res.send('Failed to send email or save data to Google Sheets.');
    }
});
// Khởi động máy chủ


app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
