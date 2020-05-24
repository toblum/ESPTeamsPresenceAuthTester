var express = require('express');
var app = express();
var axios = require('axios');
const qs = require('querystring');

// Handle API calls
app.get('/api/getDeviceLoginCode', function (req, res) {
	const tenant_id = req.query.tenant_id || "";
	const client_id = "3837bbf0-30fb-47ad-bce8-f460ba9880c3";

	if (tenant_id && tenant_id.length > 15) {
		const url = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/devicecode`;
		const payload = {
			client_id: client_id,
			scope: "offline_access openid Presence.Read User.Read"
		};
		
		console.log(`/api/getDeviceLoginCode :: Calling ${url}`);
		axios({
			method: "post",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			url: url,
			data: qs.stringify(payload)
		}).then(response => {
			// console.log("Got data", response.data);
			// Just pass the required data
			const data = {
				user_code: response.data.user_code || "",
				verification_uri: response.data.verification_uri || "",
				expires_in: response.data.expires_in || null,
				message: response.data.message || ""
			};

			res.json({error: false, message: "", data});
		}).catch(function (error) {
			console.error(error);
			res.json({error: true, type: "devicecode_request_error", message: error.message, error_description: error.error_description});
		});
	
	} else {
		res.json({error: true, type: "param_tenant_id_missing"});
	}
});

// Handle static folder
app.use(express.static(__dirname + '/static'));

// Handle 404
app.use(function(req, res, next) {
	res.status(404).send("404 - Sorry can't find that! :(");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('App listening on port:', port);
});