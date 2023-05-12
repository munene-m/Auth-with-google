const express = require("express")
const app = express()
const cors = require("cors")
const path = require('path')
const dotenv = require("dotenv")
const session = require('express-session')
const { default: MongoStore } = require('connect-mongo')(session)
const { connectDB } = require("./config/db")
const bodyParser = require("body-parser")
const authRoute = require('./routes/authRoute')
const adminRoute = require('./routes/adminRoute')
const PORT = 3000

connectDB()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
// app.use(express.static (path.join (__dirname, 'client')))

// app.get('/', (req, res) => {
//     res.sendFile('index.html')
// })


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: process.env.MONGO_CONNECTION_URL,
    collection: 'user_sessions',
  }),
}));
  
app.use("/auth", authRoute)
app.use("/predictions", adminRoute)


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'client', 'index.html');
    res.sendFile(filePath);
  });
  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})