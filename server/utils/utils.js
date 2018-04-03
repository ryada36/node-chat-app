const moment = require('moment')


var generateMessage=function(from,text){
    return{
        from,
        text,
        createdAt:moment()
    }
}

var generateLocationURL=function(from,lat,lng){
    return{
        from,
        url:`https://google.com/maps?q=${lat},${lng}`,
        createdAt:moment()
    }
}

module.exports={
    generateMessage,
    generateLocationURL
}