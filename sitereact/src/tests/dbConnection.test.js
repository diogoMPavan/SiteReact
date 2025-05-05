const { Pool } = require('pg');

test('Database connection test', async () => {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'SiteFabricio',
        password: 'postgres',
        port: 5432,
    });

    const client = await pool.connect();
    expect(client).toBeDefined();
    await client.release();
    await pool.end();
});