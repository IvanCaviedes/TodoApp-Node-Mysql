const path = require('path')

function getPath(p) {
    return path.join(__dirname+`/../views/${p}`)
}
module.exports={
    getPath
}