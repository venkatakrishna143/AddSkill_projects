const express = require('express');
const fs = require('fs');
const path = require('path');
const paht =require('path')
const app =express()


const quotes_app_of_day  = JSON.parse(
    fs.readFileSync('./quotes.json','utf-8')
)



app.get('/',(req,res)=>{
  const randomNumber = Math.floor(Math.random() * 21);
  const quotes_of_day =quotes_app_of_day[randomNumber];
   res.send(quotes_of_day)
})

app.get('/quotesList',(req, res)=>{
    res.json({
        quotesList:quotes_app_of_day
    })
})


app.listen(3000,()=>{
    console.log("server is running 3000")
})