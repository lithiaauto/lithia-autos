const http = require('http');

const data = JSON.stringify({
    label: "Bank Transfer",
    description: "Secure Wire Transfer",
    instructions: "test instructions",
    isActive: true
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/admin/payment-methods',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        console.log('Response Body:', body);
        process.exit(0);
    });
});

req.on('error', (error) => {
    console.error(error);
    process.exit(1);
});

req.write(data);
req.end();
