CREATE TABLE Users (
    User_ID INT PRIMARY KEY,
    User_password VARCHAR(100),
    Email VARCHAR(255),
    Phone_number VARCHAR(20)
);

CREATE TABLE BudgetTotals (
    Budget_ID INT PRIMARY KEY,
    Spent_dollars DECIMAL(10, 2),
    Remaining_dollars DECIMAL(10, 2),
    Total_dollars DECIMAL(10, 2),
    Categories_amount INT,
    Start_date DATE,
    End_refresh_date DATE,
    User_ID INT,
    FOREIGN KEY (User_ID) REFERENCES Users(User_ID)
);

CREATE TABLE Categories (
    Category_ID INT PRIMARY KEY,
    Max_amount DECIMAL(10, 2),
    Dollars_spent DECIMAL(10, 2),
    Num_transactions INT,
    Remaining_dollars DECIMAL(10, 2),
    Budget_ID INT,
    FOREIGN KEY (Budget_ID) REFERENCES BudgetTotals(Budget_ID)
);

CREATE TABLE Transactions (
    Transaction_ID INT PRIMARY KEY,
    Transaction_amount DECIMAL(10, 2),
    Category_ID INT,
    FOREIGN KEY (Category_ID) REFERENCES Categories(Category_ID)
);
