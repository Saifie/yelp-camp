const express = require('express');
const router=express.Router({mergeParams:true});
const {campgroundSchema,reviewSchema}=require('../schemas');
const ExpressError=require("../utils/ExpressError")
const catchAsync=require("../utils/catchAsync")
const Joi=require("joi");
const Review =require('../models/review')
const Campground = require('../models/campground');
const isLogedIn=require('../middleware')
const {reviewIsAuthor}=require('../middlewares')
const reviews=require('../controllers/reviews')

const validatereview=(req,res,next)=>{
     
    const {error} =reviewSchema.validate(req.body);
    if (error){
      const msg=error.details.map(el=>el.message).join(',')
      throw  new ExpressError(msg,400)
    }
    else{
        next()
    }
}
router.delete('/:reviewId', isLogedIn,reviewIsAuthor,catchAsync(reviews.deleteReview))


router.post('/',isLogedIn,validatereview,catchAsync( reviews.createReview))
module.exports=router;