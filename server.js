// server.js
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

// The secret should be an unguessable long string (you can use a password generator for this!)
const JWT_SECRET =
  "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

const app = express();
app.use(express.json());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');


    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get("/super-secure-resource", (req, res) => {
  let response = ""
  let status_code = 401;
  authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")){
    token = authHeader.substring(7, authHeader.length);
    try {
      jsonwebtoken.verify(token, JWT_SECRET);
      response = "Congrats! You can now accesss the super secret resource";
      status_code = 200;
    } catch {
      response = "Invalid Token";
    }
  } else {
    response = "Invalid Authorization header";
  }
  res
    .status(status_code)
    .json({ message: response });
});

app.get('/protected-users', (req, res) => {
  let status_code = 401;
  authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")){
    token = authHeader.substring(7, authHeader.length);
    try {
      jsonwebtoken.verify(token, JWT_SECRET);
      // response = "Congrats! You can now accesss the super secret resource";
      response = {
        users: [{
          firstName: 'Giovanni',
          lastName: 'Sel'
        }, 
        {firstName: 'Jack', 
        lastName: 'La Grotta'}
  ]}
      status_code = 200;
    } catch {
      response = "Invalid Token";
    }
  } else {
    response = "Invalid Authorization header";
  }

  res
    .status(status_code)
    .json(response);
})
app.get('/users', (req, res) => {
  res.status(200).json({
    users: [{
      firstName: 'Giovanni',
      lastName: 'Sel'
    }, 
    {firstName: 'Jack', 
    lastName: 'La Grotta'}
  ]
  })

})

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`${username} is trying to login ..`);

  if (username === "admin" && password === "admin") {
    return res.json({
      token: jsonwebtoken.sign({ user: "admin" }, JWT_SECRET),
    });
  }

  return res
    .status(401)
    .json({ message: "The username and password your provided are invalid" });
});

app.listen(3001, () => {
  console.log("API running on localhost:3001");
});





