const router = require('express').Router()
const cloudinary = require('cloudinary').v2;

router.get('/', (req, res) => {
    res.send('cloud test !')
})

router.get('/upload', (req, res) => {
    


// Configuration 
cloudinary.config({
  cloud_name: "ddln3zv0f",
  api_key: "459162469682382",
  api_secret: "VomoNu9PbX7C7Ix_n1hUll7LGg8"
});


// Upload

const result = cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg', {public_id: "olympic_flag_osman", folder:"Infra"})

result.then((data) => {
  console.log(data);
  console.log(data.secure_url);
  res.send(data)
}).catch((err) => {
  console.log(err);
});


// Generate 
const url = cloudinary.url("olympic_flag", {
  width: 100,
  height: 150,
  Crop: 'fill'
});



// The output url
console.log(url);
// https://res.cloudinary.com/<cloud_name>/image/upload/h_150,w_100/olympic_flag
})


module.exports = router