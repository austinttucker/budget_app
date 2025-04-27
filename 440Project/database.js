import mysql from "mysql2"

const db = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root',
    password: 'Austin05?!',
    database: 'proj'
  }).promise()


async function getUser(User_name, User_password) {
    try {
        const [rows] = await db.query(
            "SELECT User_ID, User_password FROM users WHERE User_Name = ?", 
            [User_name]
        );

        if (rows.length > 0 && rows[0].User_password === User_password) {
            return rows[0].User_ID; // Get the ID of the user
        } else {
            return null; // No user found
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function createUser(User_Name, User_Password, Email, Phone_number) {
    const User_ID = Math.floor(Math.random() * 1000000) // Generate a random user ID
    // Check if the user ID already exists in the database
    const [existingUser] = await db.query("SELECT * FROM users WHERE User_ID = ?", [User_ID])
    if (existingUser.length > 0) {
        // If the user ID already exists, generate a new one and check again
        return createUser(User_Name, User_Password, Email, Phone_number);
    }
    const [result] = await db.query("INSERT INTO users (User_ID, User_Name, User_Password, Email, Phone_number) VALUES (?, ?, ?, ?, ?)",
         [User_ID, User_Name, User_Password, Email, Phone_number]);
    return result.insertId;
}
export { createUser, getUser };