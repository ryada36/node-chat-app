const express=require('express');
const path=require('path');

var publicPath=path.join(__dirname,'./../public/');

var port=process.env.PORT || 3000;

var app=express();
app.use(express.static(publicPath));
app.listen(port,()=>{
    console.log('Server runnint at ',port);
})
