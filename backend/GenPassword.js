const bcrypt = require('bcrypt');

var password = bcrypt.hashSync('12345', 9);
console.log(password);


