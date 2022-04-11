const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

// Prepare the PDF Generation schema.
const generation = {
	html: 'template.html',
};

// Read the HTML template from disk.
const template = fs.readFileSync('./template.html', { encoding: 'utf8' });

// Pack the data in a multipart request.
const body = new FormData();
body.append('template.html', template, { filename: 'template.html' });
body.append('generation', JSON.stringify(generation));

(async () => {
	// Send the request to Processor.
	const response = await axios.post('http://localhost:8000/process', body, {
		headers: body.getHeaders(),
		responseType: 'stream',
	});
	// Save the result to a file on disk.
	await response.data.pipe(fs.createWriteStream('invoice.pdf'));
})();