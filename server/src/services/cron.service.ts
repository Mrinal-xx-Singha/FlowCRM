import cron from 'node-cron';
import { pool } from "../db/dbConnect";
import { sendReminderEmail } from './mailer.service';

export const startCronJob = async () => {
    // Runs every minute
    cron.schedule('* * * * *', async () => {
        const client = await pool.connect();
        
        try {
            // 1. Begin an isolated transaction
            await client.query('BEGIN');
            
            // 2. Fetch pending reminders and lock them using FOR UPDATE SKIP LOCKED
            // This prevents any other concurrent worker from processing the exact same reminders
            const query = `
                SELECT reminders.id, reminders.title, reminders.notes, customers.email 
                FROM reminders 
                JOIN customers ON reminders.customer_id = customers.id
                WHERE reminders.status='pending' AND reminders.remind_at <= NOW()
                FOR UPDATE SKIP LOCKED
            `;
            const result = await client.query(query);

            if (result.rows.length === 0) {
                await client.query('COMMIT');
                return;
            }

            console.log(`Processing ${result.rows.length} due reminders...`);

            // 3. Process each locked reminder sequentially
            for (const row of result.rows) {
                try {
                    // Send the email
                    await sendReminderEmail(row.email, row.title, row.notes);
                    
                    // Mark as sent
                    await client.query(`UPDATE reminders SET status='sent' WHERE id=$1`, [row.id]);
                } catch (emailError) {
                    console.error(`Failed to dispatch reminder ID ${row.id}:`, emailError);
                    // We DO NOT throw the error here, we simply leave it as 'pending'
                    // so it will be picked up on the next cron cycle for a retry.
                }
            }

            // 4. Commit the transaction to release the locks
            await client.query('COMMIT');

        } catch (error) {
            console.error('Critical failure in cron job scheduler:', error);
            await client.query('ROLLBACK'); // Abort and release locks if a massive failure occurs
        } finally {
            client.release(); // Return connection to the pool
        }
    });
};