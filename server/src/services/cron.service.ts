import cron from 'node-cron';
import { pool } from "../db/dbConnect"
import { sendReminderEmail } from './mailer.service';

export const startCronJob = async () => {
    cron.schedule('* * * * *', async () => {
        try {

        const query = `SELECT reminders.*, customers.email FROM reminders JOIN customers ON reminders.customer_id = customers.id
WHERE reminders.status='pending' AND reminders.remind_at <= NOW()`
        const result = await pool.query(query)
        for (const row of result.rows) {
            await sendReminderEmail(row.email, row.title, row.notes)
            await pool.query(`UPDATE reminders SET status='sent' WHERE id=$1`, [row.id])
        }
    } catch (error) {
        console.error('Error in cron job:', error);
    }   
    });

}