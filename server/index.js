const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('cookie-session');
const express = require('express');
const config = require('./config'); //Import db configuration
const mongoose = require('mongoose');
const cors = require('cors');

//Importing routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const course = require('./routes/course');
const cart = require('./routes/cart');
const checkout = require('./routes/checkout');

app = express();

//Configure connection to Mongo DB.
mongoose.connect(config.uri,{ useNewUrlParser: true },(err) => {
	if(err){
		console.log('Could not connect to DB '+config.uri, err);
	} else {
		console.log('Connected to ' + config.uri);
	}
});

app.use(cors({
	origin: true,
	credentials: true,
	methods: 'POST,GET'
}));
app.use(cookieParser()); // this is needed in order to csurf to work.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	secret: 'foo'
}));

app.use(express.static('public'));

//Declare port 
const PORT = process.env.PORT || 3231;

app.use('/auth', auth);
app.use('/user', user);
app.use('/course', course);
app.use('/cart', cart);
app.use('/checkout', checkout);

//Declaring server
const server = app.listen(PORT, function(){
	console.log("Server running on port " + PORT);
});

