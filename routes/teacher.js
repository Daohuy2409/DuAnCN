import express from 'express';
import bodyParser from 'body-parser';
import sharp from 'sharp';
import xlsx from 'xlsx-js-style';
import fs from 'fs'
let routerTeacher = express.Router();
import { getClassList, exportExcel } from '../db.js';


routerTeacher.get('/', function(req, res) {
  
  var username = req.session.username;
  
  getClassList(username)
  .then((result) => {
    res.render("generateQR.ejs", { MMH: result });
  })
  
});
routerTeacher.use(bodyParser.json());
var MMH = "";
routerTeacher.post('/save_image', (req, res) => {
    const { image, lesson, time } = req.body;
    const filePath = './QRcode_image/' + lesson + '/' + time + '.png';
    MMH = lesson;
    // Ghi dữ liệu hình ảnh vào tệp
    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Sử dụng sharp để tạo hình ảnh từ buffer
    sharp(imageBuffer)
      .toFile(filePath, (err, info) => {
        if (err) {
          console.error('Lỗi khi tạo hình ảnh:', err);
          return;
        }
        console.log('Hình ảnh đã được tạo và lưu:', filePath);
      });

});

routerTeacher.get('/export', (req, res) =>{
  if (MMH == "") {
    res.redirect("/teacher")
  } else {

    exportExcel(MMH).then((data) => {
      var worksheet = xlsx.utils.aoa_to_sheet(data),
          workbook = xlsx.utils.book_new();

      var wscols = [{wch: 5}, {wch: 10}, {wch: 20}, {wch: 15},
        {wch: 21}, {wch: 21}, {wch: 21}, {wch: 21}, {wch: 21}  
      ];

      worksheet['!cols'] = wscols;
      
      
      xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet 1");
      
      //tải tập tin
      var fileName =MMH + ".xlsx"
      
      
      xlsx.writeFile(workbook, fileName);
      res.download(fileName,MMH + ".xlsx", (err) => {
        if (err) {
          res.status(500).send('Lỗi khi tải xuống tệp tin');
        } else {
          fs.unlink(fileName, (er) => {
            if (er) {
              console.error('Lỗi khi xóa tệp tin:', er);
            } else {
              console.log('Tệp tin đã được xóa sau khi tải xuống');
            }
          })
        }
      })
    })
  }
  
})
export {routerTeacher};