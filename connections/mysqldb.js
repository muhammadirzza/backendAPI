const mysql=require('mysql')

const db=mysql.createConnection({
    host:'localhost',
    user:'Irzza',
    password:'09091993Mi!!',//dari workbench
    database:'team_api',
    port:'3306'
})

db.connect((err)=>{         //cek apakah sudah terubung ke mysql
    if(err){
        console.log(err)
    }
    console.log('connect sudah')
})

module.exports=db