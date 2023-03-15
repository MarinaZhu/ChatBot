const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors({origin: 'http://localhost:3000'}));

// Serve static files from the client directory
app.use(express.static('../client'));

// parse JSON request body
app.use(express.json());

// Define a route for the chatbot API
app.post('/api/chat', async (req, res) => {
    // Prepare the data to send to OpenAI's API
    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": req.body.message }]
    };
    try {
        // Send a request to OpenAI's API to generate a response
    const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });
    // Send the response back to the client
    const message = response.data.choices[0].message.content;
    res.send(`${message}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// Add CORS headers to allow requests from the client's domain
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
