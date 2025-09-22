const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the Angular dist directory
app.use(express.static(path.join(__dirname, 'dist/management-system')));

// For all other routes, serve the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/management-system/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Angular app is running on http://localhost:${PORT}`);
    console.log(`Visit the following URLs to test different pages:`);
    console.log(`  - http://localhost:${PORT}/Home`);
    console.log(`  - http://localhost:${PORT}/About`);
    console.log(`  - http://localhost:${PORT}/Employees`);
    console.log(`  - http://localhost:${PORT}/Departments`);
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