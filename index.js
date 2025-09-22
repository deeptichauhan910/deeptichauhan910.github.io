const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for serving the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all routes and serve the main HTML page (for SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Visit the following URLs to test different pages:`);
    console.log(`  - http://localhost:${PORT}/?page=Home`);
    console.log(`  - http://localhost:${PORT}/?page=About`);
    console.log(`  - http://localhost:${PORT}/?page=Employees`);
    console.log(`  - http://localhost:${PORT}/?page=Departments`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down gracefully.');
    process.exit(0);
});