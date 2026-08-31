/**
 * ============================================
 * API Integration Test Script
 * ============================================
 * Starts the server, runs endpoint tests against
 * MongoDB, and exits. Self-contained so it can
 * run in a CI/terminal without lingering processes.
 *
 * Usage: node scripts/test-api.js
 * ============================================
 */

require('dotenv').config();
const createApp = require('../server/app');

const request = (path, options = {}) => {
    const http = require('http');
    const data = options.body ? JSON.stringify(options.body) : null;
    return new Promise((resolve, reject) => {
        const req = http.request({
            host: '127.0.0.1',
            port: 3210,
            path,
            method: options.method || 'GET',
            headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}
        }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                let parsed = body;
                try { parsed = JSON.parse(body); } catch (e) {}
                resolve({ status: res.statusCode, body: parsed });
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
};

(async () => {
    const { connectDB, initializeDatabase, closeDatabase } = require('../server/db/database');

    console.log('=== Verdant Agro API Integration Tests ===\n');

    try {
        await connectDB();
        await initializeDatabase();

        // Create the Express app from the factory
        const app = createApp();

        // Start server on test port
        const server = app.listen(3210, () => {
            console.log('[Test] Server started on port 3210');
        });

        await new Promise(r => server.on('listening', r));

        // 1. Health check
        let res = await request('/api/health');
        console.log(`[1] Health ${res.status}: ${JSON.stringify(res.body.status)}`);
        console.assert(res.status === 200, 'Health should be 200');

        // 2. Valid contact submission
        res = await request('/api/contact', {
            method: 'POST',
            body: { name: 'John Doe', email: 'john@test.com', organization: 'Green Farms', subject: 'partnership', message: 'I want to partner on climate smart agriculture.' }
        });
        console.log(`[2] Contact (valid) ${res.status}: ${res.body.message}`);
        console.assert(res.status === 201, 'Contact should be 201');
        console.assert(res.body.success === true, 'Contact success flag');

        // 3. Invalid contact (bad email)
        res = await request('/api/contact', {
            method: 'POST',
            body: { name: 'Jane', email: 'bad-email', message: 'This message is definitely long enough.' }
        });
        console.log(`[3] Contact (invalid email) ${res.status}: expect validation failure`);
        console.assert(res.status === 400, 'Invalid contact should be 400');

        // 4. Newsletter subscribe
        res = await request('/api/newsletter', {
            method: 'POST',
            body: { email: 'sub@test.com' }
        });
        console.log(`[4] Newsletter (new) ${res.status}: ${res.body.message}`);
        console.assert(res.status === 201, 'Newsletter subscribe should be 201');

        // 5. Newsletter duplicate
        res = await request('/api/newsletter', {
            method: 'POST',
            body: { email: 'sub@test.com' }
        });
        console.log(`[5] Newsletter (duplicate) ${res.status}: ${res.body.message}`);
        console.assert(res.status === 200, 'Duplicate should be 200');

        // 6. Get contacts (admin)
        res = await request('/api/contact');
        console.log(`[6] Get contacts ${res.status}: count=${res.body.count}`);
        console.assert(res.status === 200, 'Get contacts should be 200');
        console.assert(res.body.count >= 1, 'Should have at least 1 contact');

        // 7. Get subscribers (admin)
        res = await request('/api/newsletter');
        console.log(`[7] Get subscribers ${res.status}: count=${res.body.count}`);
        console.assert(res.status === 200, 'Get subscribers should be 200');

        // 8. 404
        res = await request('/api/nonexistent');
        console.log(`[8] 404 ${res.status}: ${res.body.message}`);
        console.assert(res.status === 404, 'Unknown route should be 404');

        // 9. Static frontend serving
        res = await request('/');
        console.log(`[9] Static index ${res.status}: content-type=${res.body.contentType || 'n/a'}`);
        console.assert(res.status === 200, 'Static index should be 200');

        console.log('\n=== All tests passed ===');

        // Shutdown
        await new Promise(r => server.close(r));
        await closeDatabase();
        process.exit(0);
    } catch (err) {
        console.error('\n[Test] FAILED:', err.message);
        try { await closeDatabase(); } catch (e) {}
        process.exit(1);
    }
})();
