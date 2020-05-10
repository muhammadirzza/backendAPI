const {db} = require('../connections');
const {createJWTToken} = require('../helper/jwt');
const transporter = require('../helper/mailer');
const encrypt = require('../helper/crypto');

module.exports={
    userregister:(req,res)=>{
        const {username, password, email} = req.body
        const hashpass = encrypt(password)
        var sql=`select * from users where username='${username}'`   //cek username ada atau tidak
        db.query(sql, (err,result)=>{
            if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
            if(result.length) {
                console.log('username sudah dipakai')
                if(err) return res.status(500).send({message : "username sudah dipakai"})    //kalau usernamenya sudah ada maka harus pakai yang lain untuk usernamenya              
            }else{
                console.log('lewat')
                sql=`insert into users set ?`   //kalau usernamenya tidak ada maka user berhasil register, masukkan data ke dalam database
                var data={
                    username:username,
                    password:hashpass,   //password yang di input ke database berupa password yang sudah di encrypt
                    email                  //penulisannya sama dengan email:email
                }
                db.query(sql,data,(req,result2)=>{
                    if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                    //setelah itu kirimkan link email verifikasi
                    var linkVerification=`http://localhost:3000/verified?id=${result2.insertId}&password=${hashpass}` //link halaman frontend 'id' sama dengan yang di database
                    transporter.sendMail({
                        from:'testing <irzza.pwdk@gmail.com>',
                        to:email,
                        subject:'Testing email',
                        html:`Tolong klik link berikut untuk verifikasi :
                        <a href=${linkVerification}>Minimales Verification<a/>`,
                    },(err, result3)=>{
                        if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                        sql=`select * from users where id=${result2.insertId}`
                        db.query(sql,(err,result4)=>{
                            if(err) return res.status(500).send(err)    //kalau sqlnya error maka send err
                            const token=createJWTToken({id:result4[0].id, username:result4[0].username})    //buat token untuk dikirm ke front-end
                            return res.status(200).send({...result4[0], token})     //akan menjadi res.data di front end
                        })  
                    })
                })
            }

        })
    },

    userlogin:(req, res)=>{
        const {username, password}=req.query
        const hashpass = encrypt(password)
        var sql=`select * from users where username = '${username}' and password = '${hashpass}'`
        db.query(sql, (err,result)=>{
            if(err) return res.status(500).send(err)
            if(result.length) {                         //jika user ada
                const token=createJWTToken({id:result[0].id, username:result[0].username})    //buat token
                return res.status(200).send({...result[0], token:token})    //kirim result dari database beserta token ke front-end berupa objek
            }else{
                return res.status(500).send({message : "user tidak ditemukan"})
            }
        })

    },
}