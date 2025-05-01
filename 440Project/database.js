import mysql from "mysql2"

const db = mysql.createPool({
    host: '127.0.0.1', 
    user: 'root',
    password: 'Austin05?!',
    database: 'proj'
  }).promise()


async function getUser(User_ID, User_name, User_password) {
    try {
        const [rows] = await db.query(
            "SELECT User_Name, User_password FROM users WHERE User_ID = ?", 
            [User_ID]
        );
        if (rows.length > 0 && rows[0].User_Name === User_name) {
            if(rows[0].User_password === User_password) {
                return rows[0].User_ID; // Get the ID of the user
            }
            else {
                return "P"; // User name does not match
            }
        } else {
            return "N"; // No user found
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function createUser(User_ID, User_Name, User_password, Email, Phone_number) {
    // Check if the user ID already exists in the database
    const [existingUser] = await db.query("SELECT * FROM users WHERE User_ID = ?", [User_ID])
    if (existingUser.length > 0) {
        // If the user ID already exists, generate a new one and check again
        return createUser(User_ID, User_Name, User_Password, Email, Phone_number);
    }
    const [result] = await db.query("INSERT INTO users (User_ID, User_Name, User_password, Email, Phone_number) VALUES (?, ?, ?, ?, ?)",
         [User_ID, User_Name, User_password, Email, Phone_number]);
    return result.insertId;
}

async function createBudget(Total_dollars, Categories_amount, budget_length, User_ID) {
    const Spent_dollars = 0;
    const Remaining_dollars = Total_dollars;
    const Start_date = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
    var End_refresh_date;
    if(budget_length === "Weekly") {
        End_refresh_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 7 days to the current date
    }
    else if(budget_length === "Monthly") {
        End_refresh_date = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 30 days to the current date
    }
    else if(budget_length === "Yearly") {
        End_refresh_date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 365 days to the current date
    }
    else if (budget_length === "Daily") {
        End_refresh_date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10); // Add 1 day to the current date
    }
    else {
        throw new Error("Invalid budget length. Please choose Weekly, Monthly, Yearly, or Daily.");
    }
    const [result] = await db.query(
        "INSERT INTO BudgetTotals (Spent_dollars, Remaining_dollars, Total_dollars, Categories_amount, Start_date, End_refresh_date, User_ID) VALUES (?, ?, ?, ?, ?, ?, ?)",
         [Spent_dollars, Remaining_dollars, Total_dollars, Categories_amount, Start_date, End_refresh_date, User_ID]);
    return result.insertId;
}
async function createCategories(Budget_ID, CategoryData){
    for (const [Category_name, Max_amount] of CategoryData) {

        const Dollars_spent = 0;
        const Num_transactions = 0;
        const Remaining_dollars = Max_amount;

        await db.query(
            "INSERT INTO Categories (Category_name, Max_amount, Dollars_spent, Num_transactions, Remaining_dollars, Budget_ID) VALUES (?, ?, ?, ?, ?, ?)",
            [Category_name, Max_amount, Dollars_spent, Num_transactions, Remaining_dollars, Budget_ID]
        );
    }
}
async function getCategories(budgetID, userID) {
    try {
        const [r] = await db.query("SELECT * FROM BudgetTotals WHERE Budget_ID = ? AND User_ID = ?", [budgetID, userID]);
        if (r.length === 0) {
            return []; // No budget found for the user
        }
        const [categories] = await db.query("SELECT * FROM Categories WHERE Budget_ID = ?", [budgetID]);
        if (categories.length === 0) {
            return []; // No categories found for the given budget ID
        }
        return categories;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function createTransaction(Transaction_amount, Transaction_name, category) {
    const [rows] = await db.query("SELECT * FROM Categories WHERE Category_name = ?", [category]);
    const Category_ID = rows[0].Category_ID;
    const [categoryRows] = await db.query("SELECT * FROM Categories WHERE Category_ID = ?", [Category_ID]);
    var Remaining_dollars = parseFloat(categoryRows[0].Remaining_dollars) - parseFloat(Transaction_amount);
    const Dollars_spent = parseFloat(categoryRows[0].Dollars_spent) + parseFloat(Transaction_amount);
    if(Dollars_spent > categoryRows[0].Max_amount || Remaining_dollars < 0) {
        throw new Error("Transaction amount exceeds category limit or remaining dollars are negative.");
    }
    const Num_transactions = categoryRows[0].Num_transactions + 1;
    await db.query(
        "UPDATE Categories SET Dollars_spent = ?, Num_transactions = ?, Remaining_dollars = ? WHERE Category_ID = ?",
        [Dollars_spent, Num_transactions, Remaining_dollars, Category_ID]
    );
    const Spent_dollars = Dollars_spent;
    const [budgetRows] = await db.query("SELECT * FROM BudgetTotals WHERE Budget_ID = ?", [categoryRows[0].Budget_ID]);
    Remaining_dollars = budgetRows[0].Remaining_dollars - Transaction_amount;
    await db.query(
        "UPDATE BudgetTotals SET Spent_dollars = ?, Remaining_dollars = ? WHERE Budget_ID = ?",
        [Spent_dollars, Remaining_dollars, categoryRows[0].Budget_ID]
    );
    const [result] = await db.query(
        "INSERT INTO Transactions (Transaction_amount, Transaction_name, Category_ID) VALUES (?, ?, ?)",
        [Transaction_amount, Transaction_name, Category_ID]
    );
    return result.insertId;
}
async function refreshBudget(userID) {
    const [rows] = await db.query("SELECT * FROM BudgetTotals WHERE User_ID = ?", [userID]);
    console.log(userID);
    if (rows.length > 0) {
        const budget = rows[0];
        const currentDate = new Date().toISOString().slice(0, 10);
        if (budget.End_refresh_date <= currentDate) {
            // Refresh the budget
            await db.query("UPDATE BudgetTotals SET Spent_dollars = ?, Remaining_dollars = ? WHERE User_ID = ?", [0, budget.Total_dollars, userID]);
            return true;
        }
    }
    return false;
}
async function getBudget(userID){
    const [rows] = await db.query("SELECT * FROM BudgetTotals WHERE User_ID = ?", [userID]);
    if (rows.length > 0) {
        return rows[0];
    } else {
        return;
    }
}
async function changeBudgetCap(userID, newCap) {
    var Remaining_dollars = newCap - parseFloat((await db.query("SELECT * FROM BudgetTotals WHERE User_ID = ?", [userID]))[0][0].Spent_dollars);
    await db.query("UPDATE BudgetTotals SET Total_dollars = ?, Remaining_dollars = ? WHERE User_ID = ?", [newCap, Remaining_dollars, userID]);
}
async function deleteCategories(Category_IDs) {
    const placeholders = Category_IDs.map(() => "?").join(",");
    await db.query(`DELETE FROM Categories WHERE Category_ID IN (${placeholders})`, Category_IDs);
}
export { createUser, getUser, createBudget, createCategories, getCategories, createTransaction, refreshBudget, getBudget, deleteCategories, changeBudgetCap };