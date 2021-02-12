const User=require('../models/user')

module.exports.renderRegister=(req,res)=>{
	res.render('user/register')
}

module.exports.register=async (req,res)=>{
	try{
		const {username,email,password}=req.body
	const user=new User({
		email,
		username
	})
	const registerUser=await User.register(user,password);
	req.login(registerUser,err=>{
		if(err){
			return next(err)
		}
	console.log(registerUser)
	req.flash('success',"welcome to yelp camp")
	res.redirect("/campgrounds")

})}
catch(e){
	req.flash('error',e.message)
	res.redirect('/register')
}


}


module.exports.renderLogin=(req,res)=>{

	res.render('user/login')
}

module.exports.login=async (req,res)=>{
	req.flash('success',`Welcome back Mr ${req.body.username}`)

		const redirectUrl=req.session.returnTo ||'campgrounds'
		delete req.session.returnTo

	res.redirect(`${redirectUrl}`)

}

module.exports.logout=(req,res)=>{
	req.logout();
	req.flash('success',"good bye see you soon..")
	res.redirect('/campgrounds')
}