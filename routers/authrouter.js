const express=require('express')
const {Authcontrollers}=require('../controllers')
const router=express.Router()
const {auth}=require('../helper/jwtauth')

router.post('/register',Authcontrollers.userregister)
// router.get('/keeplogin/:iduser', Usercontrollers.keeplogin) //paramsnya sama dengan di user controller
// router.get('/keeplogin', auth, Usercontrollers.keeplogin) //sudah pakai token sehingga tidak butuh params lagi, pakai req.user
// router.put('/verified', Usercontrollers.userverified) 
// router.get('/login', Usercontrollers.userlogin) 
// router.post('/fblogin', Usercontrollers.loginfacebook) 

module.exports=router