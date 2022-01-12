const express=require('express')
const app=express();
const cors=require("cors");
const bodyParser=require("body-parser");
const mysql=require('mysql');
const port=8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var corsOptions = {
	origin: 'http://localhost:8081'
};
app.use(cors(corsOptions));



app.get('/',(req,res)=>{
	return res.json({message: "welcome to my application"});
});

///// mysql db connection


var db=mysql.createConnection({
	host:'192.168.1.104',
	user:'root',
	password:'Yomysql@15',
	database:'demo'
});

db.connect((err)=>{
	if(err) throw err;
	console.log("connected to db");
});


//get all users
//


app.get('/users',(req,res)=>{
	db.query('SELECT * FROM users', (err,result,field)=>{
		if(err) throw err;
		return res.send({err: false, data: result, message:'users list'});
	});
});
app.get('/user/:id',(req,res)=>{
	db.query('SELECT * FROM users WHERE id=?',req.params.id,(err,result,field)=>{
		if(err) throw err;
		return res.status(200).send({error:false ,data: result[0],message: "users list"});
	});
});

app.post('/user',(req,res)=>{
	var user=req.body.user;
	db.query('INSERT INTO users VALUES ?',{user:user},(err,result,field)=>{
		if(err) throw err;

		res.send({error: false, data: result,message: "new user has been added"});
	});
});


app.delete('/user',(req,res)=>{
	var id=req.body.id;

	if(!id){ res.status(400).send({error:true, message:"please provide user data"});}

	db.query('DELECT FROM users WHERE id = ?',id,(error,result,field)=>{
		if(err) throw err;

		return res.send({error:false, data:result, message:"user deleted successfully"});
	});
});


app.listen(port,()=>{
	console.log(`listening at port ${port}`)
});


