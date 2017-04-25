var express = require('express');
var mysql = require('mysql');
var pool = mysql.createPool({
	connectionLimit : 10,
	host : 'mysql.eecs.oregonstate.edu',
	user : 'cs290_corderda',
	password : '3368',
	database : 'cs290_corderda'
});

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 33398);

//loads the page and displays the table
app.get('/', function(req, res, next){
	var context = {};
	pool.query('SELECT * FROM workouts', function(err, rows, fields){
		if(err){
			next(err);
			return;
		}
		context.results = rows;
		res.render('home', context);
	});
});

//inserts a user-defined row into the current table; needs to be converted to POST
app.get('/insert', function(req, res, next){
	if(req.query.name=="") return;
	var context = {};
	pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `lbs`, `date`) VALUES ((?), (?), (?), (?), (?))", 
		[req.query.name, req.query.reps, req.query.weight, req.query.lbs, req.query.date], 
		function(err, result){
			if(err){
				next(err);
				return;
			}
		pool.query('SELECT * FROM workouts', function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
		//insertId seems to have a bug...
		context.message = "Added row " + result.insertId;
		context.results = rows;
		res.render('home', context);
		});
	});
});

//deletes the current row; needs to be converted to AJAX
app.get('/delete', function(req, res, next){
	var context = {};
	pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		pool.query('SELECT * FROM workouts', function(err, rows, fields){
			if(err){
				next(err);
				return;
			}
		//changedRows seems to have a bug...
		context.message = "Deleted " + (result.changedRows + 1) + " rows.";
		context.results = rows;
		res.render('home', context);
		});
	})
});

//edits the current row; may be implemented as a GET request.
	// /edit?id=#(required)&name=x&done=bool&...(not required)
app.get('/edit', function(req, res, next){
	var context = {};
	pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
		if(err){
			next(err);
			return;
		}
		if(result.length == 1){
			var curVals = result[0];
			pool.query("UPDATE workouts SET name=?, reps=?, weight=?, lbs=?, date=?",
				[req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.lbs || curVals.lbs, req.query.date || curVals.date],
				function(err, result){
					if(err){
						next(err);
						return;
					}
				pool.query('SELECT * FROM workouts', function(err, rows, fields){
					if(err){
						next(err);
						return;
					}
				context.results = rows;
				context.message = "Edited " + result.changedRows + " rows.";
				res.render('home', context);
				});
			});
		}
	});
});

//never do this in real-life -- just a shortcut for this class.
//copied with permission from the assignment description
	//modified for `lbs` to follow after `weight` and before `date`
app.get('/reset-table',function(req,res,next){
  var context = {};
  pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "lbs BOOLEAN,"+
    "date DATE)";
    pool.query(createString, function(err){
    	context.message = "Table reset.";
    	res.render('home',context);
    })
  });
});

app.use(function(req, res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express started on port ' + app.get('port') + '; terminate with Ctrl-C.');
});
