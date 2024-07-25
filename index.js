const express = require('express')
const path = require('path')
const multer = require('multer')
const app = express()

const storage = multer.diskStorage({
    destination: function(req,file,cd){
        return cd(null, './uploads')
    },
    filename:function(req,file,cd){
        return cd(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({storage})

app.set('view engine','ejs')
app.set('views', path.resolve('./views'))
app.use(express.json())

app.get('/', (req,res)=>{
    return res.render('home')
})

app.post('/profile',upload.single('profilePic'), (req,res)=>{
    console.log(req.body)
    console.log(req.file)

    return res.redirect('/')
})


app.post('/upload',upload.array('files',3), (req,res)=>{
    console.log(req.body)
    console.log(JSON.stringify(req.files))

    return res.redirect('/')
})

app.post('/photos/upload',upload.fields([{name:'avatar'},  {name:"gallery"}]), (req,res)=>{
    console.log(req.body)
    console.log(req.files)

    return res.redirect('/')
})


app.listen(8000, () => {
    console.log('Server is run on port 8000')
})