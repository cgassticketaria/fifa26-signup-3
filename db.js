const { drizzle } = require("drizzle-orm/mysql2");
const mysql = require("mysql2/promise"); 
const { mysqlTable, int, varchar, tinyint } = require('drizzle-orm/mysql-core');
const { eq, like, and, between, gt, or, isNotNull, asc } = require('drizzle-orm');
require('dotenv').config();

const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Add other connection parameters as needed
});

const db = drizzle(poolConnection);

async function checkConnection() {
    try {
        const connection = await poolConnection.getConnection();
        connection.release();
        console.log("Database is connected")
    } catch (error){
        console.error("Database connection failed: ", error)
    }
}

checkConnection();

const accounts = mysqlTable('accounts', {
    id: int('id').primaryKey(),
    email: varchar('email', { length: 70 }),
    name: varchar('name', { length: 45 }),
    phone: varchar('phone', { length: 45 }),
    domainId: int('domain_id'),
    // other columns...
});

const domains = mysqlTable('domains', {
    id: int('id').primaryKey(),
    isDs: tinyint('is_ds'),
    working: tinyint('working'),
    providerId: int('provider_id')
    // other columns...
});

const proxies = mysqlTable('proxies', {
    ip: varchar('ip', { length: 128 }),
    port: varchar('port', { length: 10 }),
    user: varchar('user', { length: 128 }),
    pwd: varchar('pwd', { length: 255 }),
    usage: varchar('usage', { length: 128 })
    // other columns...
});

async function pullProxyList() {
    try {

        const proxiesList = await db
            .select({
                ip: proxies.ip, 
                port: proxies.port, 
                user: proxies.user, 
                pwd: proxies.pwd,
            })
            .from(proxies)
            .where(
                eq(proxies.usage, "tokens")
            )
        
        return proxiesList;

    } catch (error) {
        console.error('Error fetching proxy list db.js:', error);
    }
}

async function pullAccountList() {
    try {
        const accountList = await db
            .select({
                email: accounts.email,
                name: accounts.name
            })
            .from(accounts)
            .leftJoin(domains, eq(domains.id, accounts.domainId))
            .where(
                and(
                    isNotNull(accounts.name),
                    isNotNull(accounts.phone),
                    eq(domains.isDs, 0),
                    eq(domains.working, 1),
                    eq(domains.providerId, 2)
                )
            )
            .orderBy(asc(accounts.name))
            .limit(50000)
        
        // Return the result
        return accountList;    
    } catch (error) {
        console.error('Error fetching account list db.js:', error);
    }
}


module.exports = { db, pullAccountList, pullProxyList };
