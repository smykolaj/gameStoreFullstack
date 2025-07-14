const database = require("./database");

exports.getUsers = async ({ limit, offset }) => {
    const db = await database;

    const query = `
        SELECT id, firstName, lastName, email
        FROM User
        LIMIT ? OFFSET ?;
    `;
    return db.all(query, [limit, offset]);
};

exports.getTotalUsersCount = async () => {
    const db = await database;

    const query = `SELECT COUNT(*) as count FROM User;`;
    const result = await db.get(query);
    return result.count;
};

exports.insertNewUser = async (data) => {
    const db = await database;

    const query = `
        INSERT INTO User (firstName, lastName, birthdate, email, password, role, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
        data.firstName,
        data.lastName,
        data.birthdate,
        data.email,
        data.password,
        data.role,
        data.gender,
    ];
    return db.run(query, params);
};

exports.existsByEmail = async (email) => {
    const db = await database;

    const query = `SELECT 1 FROM User WHERE email = ?`;
    const row = await db.get(query, [email]);
    return !!row;
};

exports.existsById = async (id) => {
    const db = await database;

    const query = `SELECT 1 FROM User WHERE id = ?`;
    const row = await db.get(query, [id]);
    return !!row;
};

exports.deleteUser = async (id) => {
    const db = await database;

    const query = `
        DELETE
        FROM User
        WHERE id = ?`;
    return db.run(query, [id]); // Delete user by ID
};

exports.updateUser = async (data) => {
    const db = await database;

    const query = `
        UPDATE User
        SET firstName = ?,
            lastName = ?,
            birthdate = ?,
            email = ?,
            password = ?,
            role = ?,
            gender = ?
        WHERE id = ?`;
    const params = [
        data.firstName,
        data.lastName,
        data.birthdate,
        data.email,
        data.password,
        data.role,
        data.gender,
        data.id,
    ];
    return db.run(query, params);
};

exports.getUser = async (id) => {
    const db = await database;

    const query = `
        SELECT User.ID, User.FIRSTNAME, User.LASTNAME, User.EMAIL, User.BIRTHDATE, User.ROLE, User.GENDER
        FROM User
        WHERE User.ID = ?`;
    return db.get(query, [id]);
};
exports.promoteToAdmin = async (id) => {
    const db = await database;
    const query = `
        Update User
        Set role = 'Admin'
        WHERE User.ID = ?`;
    return db.run(query, [id]);
};
exports.promoteToManager = async (id) => {
    const db = await database;
    const query = `
        Update User
        Set role = 'Manager'
        WHERE User.ID = ?`;
    return db.run(query, [id]);
};

exports.getUserByEmail = async (email) => {
    const db = await database;
    const query = `
        SELECT *
        FROM User
        WHERE User.email = ?`;
    return db.get(query, [email]);
};



exports.getUserAssociations = async (id) => {
    const db = await database;

    const query = `
        SELECT Purchase.PURCHASEDATE, Purchase.CURRENCY, Game.NAME AS gameName, Game.AUTHOR AS gameAuthor, Game.price AS gamePrice
        FROM User
        INNER JOIN Purchase ON User.id = Purchase.userId
        INNER JOIN Game ON Purchase.gameId = Game.id    
        WHERE User.ID = ?`;
    return db.all(query, [id]);
};
