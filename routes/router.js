const express = require('express')
const router = express.Router()
const { Users, Cats, Dogs } = require('../models')

// untuk mendapatkan seluruh data user
router.get('/api/users', async (req, res, next) => {
  try {
    const userList = await Users.findAll({
      // include berfungsi untuk join table sesuai dengan alias (AS) yang sudah didefinisikan di relasi yang ada di file index
      include: ['cats', 'dogs']
    })
    res.status(200).json({
      message: "SUCCESS",
      data: userList
    })
  } catch (error) {
    next(error)
  }
})
// untuk mendapatkan seluruh data kucing
router.get('/api/cats', async (req, res, next) => {
  try {
    const catsList = await Cats.findAll({
      include: ['users']
    })
    res.status(200).json({
      message: "SUCCESS",
      data: catsList
    })
  } catch (error) {
    // teruskan error ke middleware yang handle error
    next(error)
  }
})

// create user
router.post('/api/users', async (req, res, next) => {
  const { name, email, hobby, status, is_active, age, cat_name, cat_color } = req.body
  // operasi create ini sama dengan
  // INSERT INTO "users" ("uuid","name","email","hobby","status","is_active","age","createdAt","updatedAt") 
  // VALUES (uuid, name, email, hobby,status,is_active,age, createdAt, updatedAt) RETURNING 
  // "uuid", "name", "email", "hobby", "status", "is_active", "age", "createdAt", "updatedAt";
  try {
    const newUser = await Users.create({
      email: email,
      name,
      hobby,
      status,
      is_active,
      age
    })

    await Cats.create({
      name: cat_name,
      color: cat_color,
      user_uuid: newUser.uuid
    })

    if (newUser) {
      res.status(201).json({
        message: "SUCCESS",
        data: newUser
      })
    } else {
      res.status(400).json({
        message: "FAILEd"
      })
    }
  } catch (error) {
    next(error)
  }

})

// create cat
router.post('/api/cats', async (req, res, next) => {
  const { name, color, user_uuid, } = req.body

  try {
    const newCat = await Cats.create({
      name,
      color,
      user_uuid,
    })
    if (newCat) {
      res.status(201).json({
        message: "SUCCESS",
        data: newCat
      })
    } else {
      res.status(400).json({
        message: "FAILED"
      })
    }
  } catch (error) {
    next(error)
  }

})

// create dogs
router.post('/api/dogs', async (req, res, next) => {
  const { name, color, user_uuid, } = req.body

  try {
    const newDog = await Dogs.create({
      name,
      color,
      user_uuid,
    })
    if (newDog) {
      res.status(201).json({
        message: "SUCCESS",
        data: newDog
      })
    } else {
      res.status(400).json({
        message: "FAILED"
      })
    }
  } catch (error) {
    next(error)
  }

})

// edit users
router.put('/api/users/:id', async (req, res, next) => {
  const { name, email, hobby, status, is_active, age, cat_name, cat_color } = req.body
  try {
    // ini bentuk panjang
    // await Users.findOne({
    //   where: {
    //     uuid: req.params.id
    //   }
    // })
    const userToUpdate = await Users.findByPk(req.params.id)
    // jika user yang akan di edit ditemukan
    if (userToUpdate) {
      const catToUpdate = await Cats.findOne({
        where: {
          user_uuid: req.params.id
        }
      })
      const updatedCat = await catToUpdate.update({
        name: cat_name,
        color: cat_color
      })
      const updated = await userToUpdate.update({
        // kalau name dari body ada pakai name dari body, kalau tidak pakai name yang sebelumnya sudah ada di db
        name: name ?? userToUpdate.name,
        email: email ?? userToUpdate.email,
        hobby: hobby ?? userToUpdate.hobby,
        status: status ?? userToUpdate.status,
        is_active: (is_active !== null && is_active !== undefined) ? is_active : userToUpdate.is_active,
        age: age ?? userToUpdate.age,
      })
      res.status(200).json({
        message: "SUCCESS",
        data: updated
      })
    } else {
      res.status(404).json({
        message: "user not found"
      })
    }
  } catch (error) {
    next(error)
  }

})

// delete user
router.delete('/api/users/:id', async (req, res, next) => {
  try {

    const userToDelete = await Users.findByPk(req.params.id)
    // jika user yang akan di edit ditemukan
    if (userToDelete) {
      // bentuk sql nya  DELETE FROM "users" WHERE "uuid" = '29b37eb8-8509-498e-837d-db57d8ee2617'
      const deleted = await Users.destroy({
        where: {
          uuid: req.params.id
        }
      })
      // kalau deleted nya sama dengan angka 1 berarti berhasil
      console.log(deleted)
      res.status(200).json({
        message: "SUCCESS",
      })
    } else {
      res.status(404).json({
        message: "user not found"
      })
    }
  } catch (error) {
    next(error)
  }

})



module.exports = router