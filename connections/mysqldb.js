const mysql=require('mysql')

const db=mysql.createConnection({

})

db.connect((err)=>{         //cek apakah sudah terubung ke mysql
    if(err){
        console.log(err)
    }
    console.log('connect sudah')
})

module.exports=db