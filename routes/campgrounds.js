const express = require('express');
const router=express.Router();
const {campgroundSchema,reviewSchema}=require('../schemas');
const ExpressError=require("../utils/ExpressError")
const catchAsync=require("../utils/catchAsync")
const Joi=require("joi");
const Campground = require('../models/campground');
const isLogedIn=require('../middleware')
const campgrounds=require('../controllers/campgrounds')

const {validateCampground,isAuthor}=require('../middlewares')
const  multer=require("multer")

const {storage}=require("../cloudinary")
const upload=multer({storage})


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLogedIn,upload.array("image"),validateCampground,catchAsync( campgrounds.createCampground))





// .post(upload.array("image"),(req,res)=>{
//     console.log(req.files);
//     res.send("fuck it")
// })

router.get('/new',isLogedIn, campgrounds.renderNewForm)

router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLogedIn,isAuthor,upload.array("image"),validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isLogedIn,isAuthor, catchAsync(campgrounds.deleteCampground))



router.get('/:id/edit', isLogedIn,isAuthor,catchAsync(campgrounds.renderEditForm))


module.exports=router;