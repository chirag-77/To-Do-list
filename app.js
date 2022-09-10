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
  name:"Use + button to add your daily tasks"
});
const item3=new Item({
  name:"<--Check it to mark done and remove"
});

const defaultItems=[item1,item2,item3];
const listSchema={
  name: String,
  items:[itemsSchema]
};
const List = mongoose.model("List",listSchema);
app.get("/",function(req,res){
  Item.find({},function(err,foundItems){
    if(foundItems.length==0){
    Item.insertMany(defaultItems,function(err){
      if(err)
      console.log(err);
      else console.log("Successfully inserted defaults in DB.");
    })
  }
    else   res.render("list",{listTitle:"Today",newListItems:foundItems});
    })
  })


  app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;

  List.findOne({name:customListName},function(err,foundList){
    if(!foundList){
      const list = new List({
        name: customListName,
        items:defaultItems
      });
      list.save();
      res.redirect("/"+customListName);
    }
    else {
      res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
    }
  })
})
//   var today= new Date();
//   var options={weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'};
//
// var day =today.toLocaleDateString('en-US',options);

app.post("/delete",function(req,res){
  const checkedItemID=req.body.checkbox;
  const listName=req.body.listName;
  if(listName==="Today"){
  Item.findByIdAndRemove(checkedItemID,function(err){

     if(!err){
    console.log("Successfullly deleted checked item");
    res.redirect("/");
  }
  });
}



  else {
    List.findOneAndUpdate({name:listName},{$pull: {items:{_id: checkedItemID}}},function(err,foundList){
      if(!err)
      res.redirect("/"+listName);
    })
}


});


app.post("/",function(req,res){
const itemName=req.body.newItem;
const listName=req.body.listName;


const item = new Item({
  name: itemName
})
if(listName=="Today"){
  item.save();
    res.redirect("/");
}
else{
    List.findOne({name:listName},function(err,foundList){
      if(err)
      console.log(err);
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+listName);
  })

}
})

app.listen(3000,function(){
  console.log("Server live on port 3000");
})
