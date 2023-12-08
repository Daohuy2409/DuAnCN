import 'dotenv/config';
import express from 'express';
const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
import {routerLogin} from './routes/login.js'
import session from 'express-session';
import { routerTeacher } from './routes/teacher.js';
import { routerStudent } from './routes/student.js';


app.use(session({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  }));

app.use('/login', routerLogin);
app.get('/', (req, res) => {
  res.redirect('/login');
})

const requireLogin = (req, res, next) => {
  if (req.session.daDangNhap) {
    // Người dùng đã đăng nhập, tiếp tục thực hiện request
    next();
  } else {
    // Người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
    res.redirect('/login');
  }
};
app.use('/teacher', requireLogin, routerTeacher);
app.use('/student', requireLogin, routerStudent);
// Đăng xuất
app.get('/logout', (req, res) => {
  // Xóa thông tin người dùng khỏi session
  req.session.destroy(err => {
    if (err) {
      console.error('Lỗi khi đăng xuất:', err);
    } else {
      console.log('Log out');
    }
    // Redirect hoặc thực hiện các hành động khác sau khi đăng xuất
    res.redirect('/login'); // Đưa người dùng về trang đăng nhập hoặc trang chính
  });
});
app.listen(process.env.PORT, function(req, res) {
    console.log('Node server running @ http://localhost:3000/login')

})
