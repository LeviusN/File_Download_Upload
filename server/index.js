const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors')
const mysql = require('mysql')

const app = express();
app.use(express.json());

app.use(express.static('public')); 
app.use(cors()); 
app.use(fileUpload());

const db = mysql.createConnection({
    user: 'root',
    host: '192.168.0.220',
    password: 'zap',
    database: 'folderdownload',
    port: '3304',
});


app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    const myFile = req.files.file;
    const name = myFile.name
    const pathH = 'C:/Users/Niki/Desktop/Project_PDF/client/public/uploads/'+ myFile.name

    db.query('INSERT INTO downloadhome (name, pathH) VALUES (?,?)', 
    [name, pathH])

    myFile.mv(`C:/Users/Niki/Desktop/Project_PDF/client/public/uploads/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        res.send({name: myFile.name, path: `C:/Users/Niki/Desktop/Project_PDF/client/public/uploads/${myFile.name}` });
    });
})

app.get('/show', (req,res) =>{
    db.query("SELECT * FROM  downloadhome", (err,result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }})
})

app.delete('/delete/:id', (req,res) => {
    const id= req.params.id
    db.query("DELETE FROM downloadhome WHERE id = ?", id, (err,result) => {
        if (err) {
            console.log(err);
        }else{
            res.send(result);
        }
    })
})


app.listen(3001, () => {
    console.log('server is running at port 3001');
})