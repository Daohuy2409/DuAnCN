import express from 'express';
let routerLogin = express.Router();
import { checkAccount } from '../db.js';

routerLogin.use(express.static('public'));
routerLogin.use(express.json());
routerLogin.use(express.urlencoded({ extended: true}));
routerLogin.get('/', function(req, res) {
    res.render("login.ejs");
});
routerLogin.post("/login_", async function(req, res) {
    let u = req.body.username;
    let p = req.body.password;
    let us = req.body.user;

    checkAccount(u, p, us)
    .then((result) => {
        if (result != 'No') {
            var sess = req.session;
            sess.daDangNhap = true;
            sess.username = u;
            console.log("login successful");
            res.redirect('/' +  result );
        } else {
            
            res.redirect("/login");
        }
    })
    
});

export {routerLogin};