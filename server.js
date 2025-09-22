const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Angular dist directory at /dist/management-system path
app.use('/dist/management-system', express.static(path.join(__dirname, 'dist/management-system')));

// For all other routes under /dist/management-system, serve the Angular app
app.get('/dist/management-system/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/management-system/index.html'));
});

// Redirect root to the app
app.get('/', (req, res) => {
    res.redirect('/dist/management-system/Home');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Angular app is running on http://localhost:${PORT}`);
    console.log(`Visit the following URLs to test different pages:`);
    console.log(`  - http://localhost:${PORT}/dist/management-system/Home`);
    console.log(`  - http://localhost:${PORT}/dist/management-system/About`);
    console.log(`  - http://localhost:${PORT}/dist/management-system/Employees`);
    console.log(`  - http://localhost:${PORT}/dist/management-system/Departments`);
    console.log(`\nNote: Make sure to build the Angular app first with 'npm run build'`);
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