//jshint esversion:6

//require all package to be included in this file 
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", 'ejs');

// connect our database 
mongoose.connect("mongodb://localhost:27017/textEditorDB", { useNewUrlParser: true, useUnifiedTopology: true });

const filesSchema = {
    fileName: String,
    file: String // contain the file content 
}

const File = mongoose.model("File", filesSchema);

// request home route 
app.route("/")
    .get((req, res) => {
        res.render("index");
    })
    .post((req, res) => {
        // save the new file instance into my database 
        const newFile = new File({
            fileName: req.body.fileName,
            file: req.body.fileContent
        });
        newFile.save((err) => {
            if (err) {
                res.render("error", { error: err });
            } else {
                res.redirect("/view-files");
            }
        });
    });

app.route("/view-files")
    .get((req, res) => {
        // retrieve all the saved files in the database 
        File.find((err, files) => {
            if (err) {
                res.render("error", { error: err });
            } else {
                res.render("view-files", { files: files });
            }
        });
    })
    .post((req, res) => {
        res.redirect("/");
    });


app.post("/view-file", (req, res) => {
    // get a certain file in database 
    File.findById(req.body.fileID, (err, file) => {
        if (err) {
            res.render("error", { error: err });
        } else {
            res.render("specific-file", { files: file });
        }
    });
});


app.post("/update-file", (req, res) => {
    // update the selected file with the new version of it 
    File.updateOne({ _id: req.body.fileID }, { file: req.body.fileContent }, err => {
        if (err) {
            res.send("error");
        } else {
            res.redirect("/view-files");
        }
    });
});

app.post("/delete-file", (req, res) => {
    File.deleteOne({ _id: req.body.fileID }, (err) => {
        if (err) {
            res.render("error");
        } else {
            res.redirect("view-files");
        }
    });
});

// listen to port 3000
app.listen(3000, () => {
    console.log("server start running on port 3000");
});
