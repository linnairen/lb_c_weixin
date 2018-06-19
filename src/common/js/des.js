var crypto = require('crypto');
var id = 'Jdhgqwiczuq36%32hz*2$FRa';
// var id = '12345678';
exports.des = {
  algorithm:{ ecb:'des-ede3-cbc',cbc:'des-cbc' },
  encrypt:function(plaintext,iv){
    var key = new Buffer(id);
    var iv = new Buffer(iv ? iv : '01234567');
    var cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
    cipher.setAutoPadding(true) //default true
    var ciph = cipher.update(plaintext, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
  },
  decrypt:function(encrypt_text,iv){
    var key = new Buffer(id);
    var iv = new Buffer(iv ? iv : '01234567');
    var decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
    decipher.setAutoPadding(true);
    var txt = decipher.update(encrypt_text, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt;
  }
 
};