var crypto = require('crypto');
var salt = "shoppingMallProject";

module.exports = function(password){
    return crypto.createHash('sha512').update(password+salt).digest('base64');
    //나중에 더좋은 암호화 방법을 찾아보자.
}