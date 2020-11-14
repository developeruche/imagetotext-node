const express = require("express")
const multer = require("multer")
const Tesseract = require("tesseract.js")
const path = require("path")
//Initalizing Application and config
const app = express()
const PORT = process.env.PORT || 5000

//Config for image storage (MULTER)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage : storage})

//Application middleware
app.use(express.static(path.join(__dirname, "public")))


//Stating routing events
app.post("/api/v1/post", upload.single("uploadedImage"), (req, res) => {
    console.log(req.file)
    try {
        Tesseract.recognize(
            `uploads/${req.file.filename}`,
            "eng",
            {
                logger: m => console.log(m)
            }
        )
        .then(({data: {text}}) => {
            res.json({
                message: text
            })
        })
    } catch (err) {
        console.log()
    }
})

//listen for events
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})

