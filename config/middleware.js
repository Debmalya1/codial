//to pass the flash message to the ejs file this middleware is used.. it fetches the msg from req and put it to the locals
module.exports.setFlash=function(req,res,next){

    res.locals.flash={
        'success':req.flash('success'),
        'error':req.flash('error')
    }
    next();
}