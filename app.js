 //jshint esversion:6

const express = require("express");
const bodyParser=require("body-parser");

const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

var newListItems=["Buy Snack","Sell Snacks"];

app.get("/",function(req,res){
  var today= new Date();
  var options={weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'};

var day =today.toLocaleDateString('en-US',options);
res.render("list",{kindOfDay:day,newListItems:newListItems});


})
app.post("/",function(req,res){
  newListItems.push(req.body.newItem);
  res.redirect("/");
})
app.listen(3000,function(){
  console.log("Server live on port 3000");
})
