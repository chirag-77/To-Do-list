 //jshint esversion:6

const express = require("express");
const bodyParser=require("body-parser");
const mongoose = require("mongoose")
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB");
// var newListItems=["Welcome to your to-do-list","Use + buuton to add your daily tasks","<--Check it to mark done and remove"];

const itemsSchema={
  name: String
};
const Item =mongoose.model("Item",itemsSchema);
const item1=new Item({
  name:"Welcome to your to-do-list"
});
const item2=new Item({
  name:"Use + buuton to add your daily tasks"
});
const item3=new Item({
  name:"<--Check it to mark done and remove"
});

const defaultItems=[item1,item2,item3];


app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length==0){
    Item.insertMany(defaultItems,function(err){
      if(err)
      console.log(err);
      else console.log("Successfully inserted defaults in DB.");
    })
  }
    else   res.render("list",{kindOfDay:"Today",newListItems:foundItems});
    })
  })

//   var today= new Date();
//   var options={weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'};
//
// var day =today.toLocaleDateString('en-US',options);

app.post("/delete",function(req,res){
  const checkedItemID=req.body.checkbox;
  Item.findByIdAndRemove(checkedItemID,function(err){
    if(!err)
    console.log("Successfullly deleted checked item");
  })
  res.redirect("/");
})


app.post("/",function(req,res){
const itemName=req.body.newItem;
const item = new Item({
  name: itemName
})
item.save();
  res.redirect("/");
})

app.listen(3000,function(){
  console.log("Server live on port 3000");
})
