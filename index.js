const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes/Routes');
const multer = require('multer')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const app=express()
app.use(express.json());

const port = process.env.PORT || 3001

app.use(cors());


mongoose
.connect(process.env.MONGODB_URL)
.then(()=>console.log('Connect to mongoDB successful!'))
.catch((err)=>console.log(err));


app.use(routes);


const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({storage:storage})

app.use('/images', express.static('upload/images'))
app.post('/upload', upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

app.listen(port,()=>console.log("server is running on port:"+port)
)
