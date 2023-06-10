const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
//get token from header
    const token = req.header('Authorization')?.replace('Bearer ','');

    if (!token){
        return res.status(401).json(
            {
                error: 'Access denied. No token provided.'
            }
        );
    }
    try {
        //validate token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
        // add user from payload
        req.user = decoded;
        next();
    }catch (ex) {
        res.status(400).send('Invalid token. ');
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
