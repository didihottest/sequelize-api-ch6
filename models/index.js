const Users = require('./users')
const Cats = require('./cats')
const Dogs = require('./dogs')


// definisikan relasi
// user punya banyak (hasMany) cats
// user adalah parent dari cats
Users.hasMany(Cats, {
  foreignKey: 'user_uuid',
  as: 'cats'
})

// cats adalah kepemilikan dari (belongsTo) users
// cats adalah children dari user
Cats.belongsTo(Users, {
  foreignKey: 'user_uuid',
  as: 'users'
})

Users.hasMany(Dogs, {
  foreignKey: 'user_uuid',
  as: 'dogs'
})

Dogs.belongsTo(Users, {
  foreignKey: 'user_uuid',
  as: 'users'
})

module.exports = {
  Users,
  Cats,
  Dogs
}