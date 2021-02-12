
const isLogedIn=(req,res,next)=>{
 if (!req.isAuthenticated()){
 	req.session.returnTo=req.originalUrl
        req.flash('error',`You Must Be Signed In First To Do This....`)
        return res.redirect('/login')
    }
    next()
}



module.exports=isLogedIn