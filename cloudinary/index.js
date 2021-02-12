const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
	cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
	api_key:process.env.CLOUDINARY_KEY,
	api_secret:process.env.CLOUDINARY_SECRET
})

const storage=new CloudinaryStorage({
	cloudinary,
	params:{
	folder:"yelpCamp",
	allowedFormets:["jpeg","png","jpg","mp3","gif","mp4","bmp","eps","pdf","tiff","psd","ai","doc"]
}
});

module.exports={
	cloudinary,
	storage
}