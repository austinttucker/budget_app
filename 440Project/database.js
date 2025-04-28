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

async function createBudget(User_ID, Total_dollars, Categories_amount, budget_length) {
    const Budget_ID = Math.floor(Math.random() * 1000000) // Generate a random budget ID
    const Spent_dollars = 0;
    const Remaining_dollars = Total_dollars;
    const Start_date = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
    var End_refresh_date;
    if(budget_length == "Weekly") {
        End_refresh_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 7 days to the current date
    }
    else if(budget_length == "Monthly") {
        End_refresh_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 30 days to the current date
    }
    else if(budget_length == "Yearly") {
        End_refresh_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 365 days to the current date
    }
    else if (budget_length == "Daily") {
        End_refresh_date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 1 day to the current date
    }
    else {
        throw new Error("Invalid budget length. Please choose Weekly, Monthly, Yearly, or Daily.");
    }
    const [result] = await db.query(
        "INSERT INTO BudgetTotals (Budget_ID, Spent_dollars, Remaining_dollars Total_dollars, Categories_amount, Start_date, End_refresh_date, User_ID) VALUES (?, ?, ?, ?, ?, ?, ?)",
         [Budget_ID, Spent_dollars, Remaining_dollars, Total_dollars, Categories_amount, Start_date, End_refresh_date, User_ID]);
    return result.insertId;
}
export { createUser, getUser, createBudget };