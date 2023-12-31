const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const cors = require('cors')

const app = express();


app.use(express.json());
app.use(cors());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
console.log("Authenticating")
const token = req.headers.authorization;

if (!token) {
  console.error('Sin token de acceso');
  return res.status(401).json({ message: "Sin token de acceso" });
}

try {
  const verified = jwt.verify(token, 'fingerprint_customer');
  req.user = verified;
  next();
} catch (err) {
  res.status(400).send('Invalid Token');
}
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

