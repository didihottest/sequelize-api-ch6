require('dotenv').config()
const express = require('express')
const app = express()
const sequelize = require('./utils/databaseConnection')
const routes = require('./routes/router')


app.use(express.json())
app.use(routes)

// middleware untuk handle error
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: statusCode,
    message: error.message
  })
})

sequelize.sync(

  {
    // fungsi alter akan drop kolom ketika kolom yang di database dengan yang di model berbeda
    // fungsi alter ini akan mengutamakan bentuk data yang di model dibandingkan dengan yang di 
    // database
    // alter: true,

    // drop semua table kemudian buat ulang tabel nya sesuai dengan model
    // force: true
  }

).then(() => {
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  })
}).catch((error) => {
  console.log(error);
})
