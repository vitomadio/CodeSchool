const env = process.env.NODE_ENV || 'development';

const config = {
	development: {
		url: "http://localhost:3231/"
	},
	production: {
		url: "http://codeschool-api.herokuapp.com/"
	}
}[env];

export default config;