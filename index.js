const express = require('express')
const path = require('path')
const multer = require('multer')


const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "NodeJS Demo",
        version: "0.1.0",
        description: "Upload files",
    },
    servers: [
        {
            "url": "http://localhost:8000/",
            "description": "Local Dev"
        },
    ],
}
const options = {
    swaggerDefinition,
    apis: ['./index.js']
}

// Swagger UI
const swaggerSpecs = swaggerJsdoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))


app.get('/', (req,res)=>{
    return res.render('home')
})


/**
 * @swagger
 * /profile:
 *      post:
 *          summary: Uploads a file.
 *          discription: Upload file to server
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              fileName:
 *                                  type: string
 *                                  format: binary
 *          responses:
 *             200:
 *                 description: "File uploaded successfully"       
 */

app.post('/profile',upload.single('fileName'), (req,res)=>{
    return res.status(200).json({ status: 'File uploaded successfully' })
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
