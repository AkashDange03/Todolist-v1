const express = require("express");

const bodyparser = require("body-parser");

const date = require(__dirname + "/date.js");

const mongoose = require("mongoose");

const _ = require("lodash");

const app = express();

app.use(express.static("public"));


app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));


let item = "";

mongoose.connect("mongodb+srv://akash-dange:L1xqZUf2owI4BBsu@cluster0.pfrohj1.mongodb.net/todolistDB").then(() => console.log("successfully connected")).catch((e) => console.log(e));

const itemSchema = mongoose.Schema({
    name: String
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "code"
});
const item2 = new Item({
    name: "gym"
});
const item3 = new Item({
    name: "sleep"
});

const defaultitems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema);



// Item.insertMany(defaultitems).then(()=>console.log("default inserted")).catch((e)=>{console.log(e)});

let items = [];

app.get("/", (req, res) => {


    // let days=["sunday","monday","tuesday","wednsday","thursday","friday","saturday"];

    // // let day ="";

    // // if(currentDay === 6 || currentDay ===0){
    // //     day="weekend";
    // // }
    // // else{
    // //    day="weekday";
    // // }


    // let day=date.getday();


    let day = date.getdate();
    Item.find({}).then((data) => {
        if (data.length === 0) {
            Item.insertMany(defaultitems).then(() => console.log("default inserted")).catch((e) => { console.log(e) });
            res.redirect("/")
        }
        else {
            res.render("index", { listtitle: day, newtasks: data });
        }

    }).catch((e) => {
        console.log(e);
    });


});


app.get("/:customlistName", (req, res) => {
    const customlistName = _.capitalize(req.params.customlistName);
    List.findOne({ name: customlistName }).then((data) => {
        if (!data) {
            // console.log("Doesn't exist");
            const list = new List({
                name: customlistName,
                items: defaultitems
            })

            list.save();
            res.redirect("/" + customlistName);
        } else {
            // console.log("exists");
            res.render("index", { listtitle: customlistName, newtasks: data.items })
        }
    }).catch((e) => console.log(e));



})



app.post("/", (req, res) => {

    const itemName = req.body.newitem;
    const listname = req.body.list;

    const item = new Item({
        name: itemName
    });

    let day = date.getdate();
    if (listname === day) {
        item.save().then(()=>res.redirect("/"));
        
    } else {
        List.findOne({ name: listname }).then((data) => {
            data.items.push(item);
            data.save();
            res.redirect("/" + listname);
        }).catch((e) => {

        });
    }



    // console.log(req.body);
    // if (req.body.list === "Work") {
    //     worklist.push(item);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     res.redirect("/");
    // }
});

app.post("/delete", (req, res) => {
    const id_del = req.body.checkbox;
    const ListName = req.body.listName;

    if (ListName === day) {
        Item.deleteOne({ _id: id_del }).then(() => {
            // console.log("deleted")
            res.redirect("/");
        }).catch((e) => {
            console.log(e);
        })
    }
    else{
        List.findOneAndUpdate({name:ListName} ,{$pull: {items: {_id:id_del}}}).then((data)=>{
        //    console.log("deleted");
           res.redirect("/"+ListName);
        }).catch((e)=>{
            console.log(e);
        })
    }

})

app.get("/about", (req, res) => {
    res.render("about");
});
app.listen("3000", () => {
    console.log("server is running on port 3000");
});