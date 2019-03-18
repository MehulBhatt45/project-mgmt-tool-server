var notificationModel = require('../model/notification.model');
var http = require('http');

var obj = {};
obj.postCode = function (title,body,user) {
	console.log("sending notification");

	var post_data={

		"notification": {
			"title": title ,
			"body": body
		},
		"registration_ids" :[user]
	}
	post_data = JSON.stringify(post_data);
	console.log("post data",post_data);


  // An object of options to indicate where to post to
  var post_options = {
  	host: 'fcm.googleapis.com',
  	port: 80,
  	path: '/fcm/send',
  	method: 'POST',
  	headers: {
  		'Content-Type': 'application/json',
  		'Authorization': 'key=AAAAtcO-yDs:APA91bHAhrA-O2DldJDCdZfdMKFw_FWs4VgusFMc7rXbuonfwYIm_TWjiR-JyKPOLzPMPHnDVKniWM0F98Kc-wQKLvJ2n7whZwPKsgzhEgBNlkBVP2C4uQov_9pnbuHz4CmL4j3MyO5a'
  	}
  };
  console.log("post options",post_options);
  // Set up the request
  var post_req = http.request(post_options, function(res) {
  	console.log('Status: ' + res.statusCode);
  	console.log('Headers: ' + JSON.stringify(res.headers));
  	res.setEncoding('utf8');
  	res.on('data', function (chunk) {
  		console.log('Response: ' + chunk);
  	});
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

module.exports = obj;
