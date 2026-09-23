const bcrypt = require('bcrypt')
const saltRound = 5

const encryptPwd = (data) => {
    //data adalah password dari user input
    const encrypted = bcrypt.hashSync(data,saltRound)
    return encrypted
}

const decryptPwd = (data, hashPwd) => {
    //data adalah password dari user input
    //hashPwd dari database
    const decrypted = bcrypt.compareSync(data, hashPwd)
    return decrypted
}

module.exports = {
    encryptPwd,
    decryptPwd,
}