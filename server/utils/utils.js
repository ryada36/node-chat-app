var generateMessage=function(from,text){
    return{
        from,
        text,
        createdAt:new Date().getTime()
    }
}

var generateLocationURL=function(from,lat,lng){
    return{
        from,
        url:`https://google.com/maps?q=${lat},${lng}`,
        createdAt:new Date().getTime()
    }
}

module.exports={
    generateMessage,
    generateLocationURL
}