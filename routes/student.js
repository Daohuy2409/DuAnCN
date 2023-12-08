import express from 'express';
import { DiemDanh} from '../db.js';

let routerStudent = express.Router();
routerStudent.get('/', function(req, res) {
    res.render("scanQR.ejs");
    
});

routerStudent.use(express.json());

routerStudent.post('/send-data', (req, res) => {
  const data = req.body;
  const MSV = parseInt(req.session.username);

  const endTime = new Date(data.endTime.join(' '));
  const curentTime = new Date();

  if (endTime.getTime() < curentTime.getTime()) {
    res.send("Đã hết thời gian điểm danh!")
  } else {
    DiemDanh(data.MMH, data.time, MSV).then((result) => {
      res.send(result);
    })
  }

});

export {routerStudent};