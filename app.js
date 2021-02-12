if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}

const mongoSanitize = require('express-mongo-sanitize');

const helmet = require("helmet");
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError")
const catchAsync=require("./utils/catchAsync")
const Joi=require("joi");
const {campgroundSchema,reviewSchema}=require('./schemas');
const Review =require('./models/review')

const User=require('./models/user')
const daUrl= process.env.DB_URL ||"mongodb://localhost:27017/yelp-camp"

const session=require('express-session')
const MongoStore = require('connect-mongo')(session);
const flash =require('connect-flash')

const campgroundrouter=require('./routes/campgrounds')
const reviewrouter=require('./routes/reviews')
const userrouter=require('./routes/user')
const passport=require('passport');
const localStrategy=require('passport-local');
 const secret=process.env.SECRET || "thisisfuckingsecret"
 const port =process.env.PORT ||3000


mongoose.connect(daUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine("ejs",ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(mongoSanitize({
  replaceWith: '_'
}))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))



const store=new MongoStore({
    url:daUrl,
     secret,
     touchAfter:24*60*60
    

});
store.on("error",function (e) {
    console.log(e)
    
})
const sessionConfig={
    store,
    name:"session",
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }

}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dp2mouhru/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://www.pexels.com/",
                "https://burst.shopify.com/",
                "https://pixabay.com/",
                "https://www.freeimages.com/",
                "https://kaboompics.com/",
                "https://stocksnap.io/",
                "https://www.canva.com/photos/free/",
                "https://www.lifeofpix.com/",
                "https://gratisography.com/",
                "https://www.flickr.com/",
                "https://jopwell.pixieset.com/",
                "https://www.flickr.com/photos/wocintechchat/",
                "https://createherstock.com/free-stock-photos/",
                "https://www.istockphoto.com/",
                "https://picjumbo.com/",
                "https://crello.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);




app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
     res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next()
})






app.get('/', (req, res) => {
    res.render('home')
});

app.use('/campgrounds',campgroundrouter)

app.use('/campgrounds/:id/reviews',reviewrouter)
app.use('/',userrouter)



app.all('*',(req,res,next)=>{
    next(new ExpressError("ah hoo page not found" ,404))
})

app.use((err,req,res,next)=>{
    const {status=501}=err;
    if (!err.message){
        err.message="ah oh no something went wrong"
    }
    res.status(status).render('campgrounds/error',{err
    })
})



app.listen(port, () => {
    console.log('Serving on port 3000')
})