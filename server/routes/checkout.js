const express = require('express');
const router = express.Router();
const config = require('../config');

// MODELS TO IMPORT
const Order = require('../models/order');
const Invoice = require('../models/invoice');


// CHECKOUT WITH PAYPAL REST SDK FOR TDC
const paypal = require('paypal-rest-sdk');


paypal.configure({
  'mode': 'sandbox', //sandbox or live 
  'client_id': config.paypal_id,
  'client_secret': config.paypal_secret
});



/*=========== CHECKOUT WITH PAYPAL REST SDK FOR TDC ==================*/

router.post('/tdc', (req,res) => {
	console.log(req.body)
	var card_data = {
	  "type": req.body.type, //VISA MASTER 
	  "number": req.body.ccnumber, //type number
	  "expire_month": req.body.month, //type number
	  "expire_year": req.body.year, //type number
	  "cvv2": req.body.cvv, //type number
	  "first_name": req.body.name, //type string
	  "last_name": req.body.lastName //type string
	};
		 
	var create_payment_json = {
	    "intent": "sale",
	    "payer": {
	        "payment_method": "credit_card",
	        "funding_instruments": [{
	            "credit_card": card_data 
	            
	        }]
	    },
	    "transactions": [{
	        "amount": {
	            "total": req.body.totalAmt, //type number
	            "currency": "USD",
	            // "details": {
	            //     "subtotal": "5",
	            //     "tax": "1",
	            //     "shipping": "1"
	            // }
	        },
	        "description": "Thank you for your purchase!"
	    }]
	};

	paypal.payment.create(create_payment_json, (err, payment) => {
	    // if (error) {
	    //     res.json({success:false, message:error})
	    // } else {
	    //     res.json({success:true , message:"payment successfull", payment:payment})   
	    // }
	    if (err) {
			console.log(JSON.stringify(err));
		} else {
			// console.log("Create Payment Response");
			console.log(JSON.stringify(payment));
			res.json(payment)
		  	//you forgot to redirect your response to paypal sandbox
	        var redirectUrl;
	        for(var i=0; i < payment.links.length; i++) {
	            var link = payment.links[i];
	            if (link.method === 'REDIRECT') {
	                redirectUrl = link.href;
	            }
	        }
	        // res.json({url:redirectUrl});
		}
	});
	
});

//Retrieve invoice
router.get('/invoice-tdc/:id', (req,res) => {
	var paymentId = req.params.id;
	paypal.payment.get(paymentId, (error, payment) => {
	    if (error) {
	        res.json({success: false, message: err});
	        throw error;
	    } else {
	       	res.json({success:true, payment:payment});  
	    }
	});
});

//==================PAYMENT WITH PAYPAL======================================>

router.get('/success', (req, res) => {
    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };
    console.log('executed')

    paypal.payment.execute(paymentId, payerId, (error, payment) => {
        if(error){
            console.error(error);
        } else {
            if (payment.state === 'approved'){ 
            	// let url = 'http://localhost:3000?message=Transaction%approved&state='+payment.state;
                res.json(payment);
            } else {
                res.json({success:false,message:"Transaction failed!"})
            }
        }
    });
});

router.post('/', (req,res) => {

	const items = req.body.order.courses.map(course => {
		return {
			"name":course.title,
			"sku":"item",
			"price":course.price,
			"currency":"USD",
			"quantity":"1"
		}
	});

	console.log(req.body.total)

	const total = req.body.total.toString()
	
	var create_payment_json = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls": {
			"return_url": "http://localhost:3000/checkout",
			"cancel_url": "http://localhost:3000/checkout"
		},
		"transactions": [{
			"item_list":{items},
			// "item_list": {
			// 	"items": [{
			// 		"name": req.body.course.title,
			// 		"sku": "item",
			// 		"price": req.body.course.price,
			// 		"currency": "USD",
			// 		"quantity": "1"
				// }]
			// },
			"amount": {
				"currency": "USD",
				"total": req.body.total
			},
			"description": "Thank you for your purchase!"
		}]
	};


	paypal.payment.create(create_payment_json, (err, payment) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Create Payment Response");
			console.log(payment);

		  	//you forgot to redirect your response to paypal sandbox
	        var redirectUrl;
	        for(var i=0; i < payment.links.length; i++) {
	            var link = payment.links[i];
	            if (link.method === 'REDIRECT') {
	                redirectUrl = link.href;
	            }
	        }
	        res.json({url:redirectUrl});
		}
	});

});

module.exports = router;