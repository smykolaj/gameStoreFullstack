const { join } = require("node:path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require('bcrypt');

const database =  open({
    filename: join(__dirname, "../project.db"),
    driver: sqlite3.Database,
});
(async () => {
    try {
        const db = await database;

        // Enable foreign key constraints
        await db.exec(`PRAGMA foreign_keys = ON;`);

        const createUserTable = `
            CREATE TABLE IF NOT EXISTS User (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                birthdate DATE NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                gender TEXT NOT NULL
            )`;

        const createGameTable = `
            CREATE TABLE IF NOT EXISTS Game (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                author TEXT NOT NULL,
                price REAL NOT NULL,
                releaseDate DATE NOT NULL,
                genre TEXT NOT NULL
            )`;

        const createPurchaseTable = `
            CREATE TABLE IF NOT EXISTS Purchase (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER NOT NULL,
                gameId INTEGER NOT NULL,
                purchaseDate DATE NOT NULL,
                currency TEXT NOT NULL DEFAULT "USD",
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (gameId) REFERENCES Game(id) ON DELETE CASCADE
            )`;

        await db.exec(createUserTable);
        await db.exec(createGameTable);
        await db.exec(createPurchaseTable);

        const userCount = (await db.get(`SELECT COUNT(*) AS count FROM User`)).count;
        if (userCount === 0) {
            const insertUser = `
                INSERT INTO User (firstName, lastName, birthdate, email, password, role, gender)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const userData = [
                ["Mykola", "Sukonnik", "2005-01-13", "smykolka@gmail.com", bcrypt.hashSync("admin",10), "Admin", "Male"],
                ["Joe", "Doe", "1990-04-15", "joe.doe@example.com", bcrypt.hashSync("password123",10), "Manager", "Male"],
                ["May", "Chase", "1998-11-20", "may.chase@example.com", bcrypt.hashSync("mypassword",10), "User", "Female"],
                ["Allen", "Smith", "1988-08-05", "allen.smith@example.com", bcrypt.hashSync("securepass",10), "User", "Other"],
                ["Piotr", "Kowalik", "1992-07-12", "piotr.kowalik@example.com", bcrypt.hashSync("peter123",10), "User", "Male"],
                ["Anna", "Kravets", "2001-03-18", "anna.kravets@example.com", bcrypt.hashSync("anna2024",10), "User", "Female"],
                ["Victor", "Belov", "1985-09-30", "victor.belov@example.com", bcrypt.hashSync("vbelov2024",10), "User", "Male"],
                ["Emma", "Taylor", "1995-02-21", "emma.taylor@example.com", bcrypt.hashSync("emmataylor",10), "User", "Female"],
                ["Liam", "Nguyen", "1999-06-25", "liam.nguyen@example.com", bcrypt.hashSync("liamnguyen",10), "User", "Male"],
                ["Sofia", "Hernandez", "2003-05-14", "sofia.hernandez@example.com", bcrypt.hashSync("sofia2023",10), "User", "Female"],
                ["Lucas", "Brown", "1989-03-11", "lucas.brown@example.com", bcrypt.hashSync("lucas123",10), "Manager", "Male"],
                ["Olivia", "Johnson", "1996-07-23", "olivia.johnson@example.com", bcrypt.hashSync("olivia456",10), "User", "Female"],
                ["Ethan", "Garcia", "1993-02-09", "ethan.garcia@example.com", bcrypt.hashSync("secure789",10), "User", "Male"],
                ["Mia", "Martinez", "1998-12-13", "mia.martinez@example.com", bcrypt.hashSync("mia2024",10), "User", "Female"],
                ["Noah", "Rodriguez", "2000-01-20", "noah.rodriguez@example.com", bcrypt.hashSync("noah2023",10), "User", "Male"],
                ["Ava", "Lee", "1994-04-05", "ava.lee@example.com", bcrypt.hashSync("ava999",10), "User", "Female"],
                ["William", "Hall", "1997-09-08", "william.hall@example.com", bcrypt.hashSync("william2024",10), "User", "Male"],
                ["Emily", "Allen", "1992-10-19", "emily.allen@example.com", bcrypt.hashSync("emily123",10), "User", "Female"],
                ["James", "Harris", "1990-05-29", "james.harris@example.com", bcrypt.hashSync("james456",10), "Admin", "Male"],
                ["Sophia", "Young", "2001-11-30", "sophia.young@example.com", bcrypt.hashSync("sophia2023",10), "User", "Female"]
            ];


            for (const user of userData) {
                await db.run(insertUser, user);
            }
        }

        const gameCount = (await db.get(`SELECT COUNT(*) AS count FROM Game`)).count;
        if (gameCount === 0) {
            const insertGame = `
                INSERT INTO Game (name, author, price, releaseDate, genre)
                VALUES (?, ?, ?, ?, ?)`;
            const gameData = [
                ["STALKER", "GSC Game World", 19.99, "2007-03-20", "Action"],
                ["Dark Souls", "FromSoftware", 39.99, "2011-09-22", "RPG"],
                ["Hollow Knight", "Team Cherry", 14.99, "2017-02-24", "Platformer"],
                ["Fortnite", "Epic Games", 0.00, "2017-07-25", "Survival"],
                ["Minecraft", "Mojang Studios", 29.99, "2011-11-18", "Survival"],
                ["The Witcher 3", "CD Projekt Red", 49.99, "2015-05-19", "RPG"],
                ["Cyberpunk 2077", "CD Projekt Red", 59.99, "2020-12-10", "RPG"],
                ["Celeste", "Maddy Makes Games", 19.99, "2018-01-25", "Platformer"],
                ["Elden Ring", "FromSoftware", 59.99, "2022-02-25", "RPG"],
                ["Portal 2", "Valve", 9.99, "2011-04-19", "Puzzle"],
                ["Overwatch", "Blizzard Entertainment", 39.99, "2016-05-24", "Action"],
                ["Doom", "id Software", 29.99, "2016-05-13", "Action"],
                ["Stardew Valley", "ConcernedApe", 14.99, "2016-02-26", "RPG"],
                ["Ori and the Blind Forest", "Moon Studios", 19.99, "2015-03-11", "Platformer"],
                ["Among Us", "Innersloth", 5.00, "2018-11-16", "Survival"],
                ["Tetris Effect", "Monstars Inc.", 39.99, "2018-11-09", "Puzzle"],
                ["Spelunky 2", "Mossmouth", 19.99, "2020-09-15", "Platformer"],
                ["God of War", "Santa Monica Studio", 49.99, "2018-04-20", "Action"],
                ["Terraria", "Re-Logic", 9.99, "2011-05-16", "Survival"],
                ["Hades", "Supergiant Games", 24.99, "2020-09-17", "RPG"]
            ];


            for (const game of gameData) {
                await db.run(insertGame, game);
            }
        }

        const purchaseCount = (await db.get(`SELECT COUNT(*) AS count FROM Purchase`)).count;
        if (purchaseCount === 0) {
            const insertPurchase = `
                INSERT INTO Purchase (userId, gameId, purchaseDate, currency)
                VALUES (?, ?, ?, ?)`;
            const purchaseData = [
                [1, 2, "2023-12-01", "USD"],
                [2, 4, "2023-11-15", "EUR"],
                [3, 1, "2023-10-05", "USD"],
                [4, 5, "2023-09-20", "PLN"],
                [5, 3, "2023-08-25", "USD"],
                [6, 6, "2023-07-14", "GBP"],
                [7, 7, "2023-06-30", "USD"],
                [8, 9, "2023-05-10", "EUR"],
                [9, 8, "2023-04-18", "USD"],
                [10, 10, "2023-03-29", "PLN"],
                [11, 1, "2023-02-10", "USD"],
                [12, 2, "2023-01-20", "GBP"],
                [13, 3, "2022-12-15", "PLN"],
                [14, 4, "2022-11-05", "USD"],
                [15, 5, "2022-10-25", "EUR"],
                [16, 6, "2022-09-14", "PLN"],
                [17, 7, "2022-08-30", "USD"],
                [18, 8, "2022-07-18", "GBP"],
                [19, 9, "2022-06-15", "EUR"],
                [20, 10, "2022-05-12", "PLN"]
            ];


            for (const purchase of purchaseData) {
                await db.run(insertPurchase, purchase);
            }
        }

    } catch (error) {
        console.error("Error setting up the database:", error.message);
    }
})();
module.exports = database;

