const database = require("./database");


exports.getPurchases = async ({ limit, offset }) => {
    const db = await database;

    const query = `
        SELECT * FROM Purchase
        LIMIT ? OFFSET ?;
    `;
    return db.all(query, [limit, offset]);
};

exports.getTotalPurchasesCount = async () => {
    const db = await database;

    const query = `SELECT COUNT(*) as count FROM Purchase;`;
    const result = await db.get(query);
    return result.count;
};

exports.insertNewPurchase = async (data) => {
    const db = await database;
    const query = `
        INSERT INTO Purchase (userId, gameId, purchaseDate, currency)
        VALUES (?, ?, ?, ?)`;
    return db.run(query, [data.userId, data.gameId, data.purchaseDate, data.currency]);
};

exports.fkExist = async (purchase) => {
    const db = await database;
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM User WHERE id = ?) AS userExists,
            (SELECT COUNT(*) FROM Game WHERE id = ?) AS gameExists`;
    const row = await db.get(query, [purchase.userId, purchase.gameId]);
    return row.userExists > 0 && row.gameExists > 0;
};

exports.existsById = async (id) => {
    const db = await database;

    const query = `SELECT 1 FROM Purchase WHERE id = ?`;
    const row = await db.get(query, [id]);
    return !!row;
};

exports.deletePurchase = async (id) => {
    const db = await database;

    const query = `
        DELETE
        FROM Purchase
        WHERE id = ?`;
    return db.run(query, [id]);
};

exports.updatePurchase = async (data) => {
    const db = await database;

    const query = `
        UPDATE Purchase
        SET userId = ?,
            gameId = ?,
            purchaseDate = ?,
            currency = ?
        WHERE id = ?`;
    const params = [data.userId, data.gameId, data.purchaseDate, data.currency, data.id];
    return db.run(query, params);
};

exports.getPurchase = async (id) => {
    const db = await database;

    const query = `
        SELECT Purchase.id, gameId, userId, purchaseDate, currency, 
               Game.NAME AS gameName, Game.AUTHOR AS gameAuthor, Game.PRICE AS gamePrice,
               User.firstName AS userFirstName, User.lastName AS userLastName, 
               User.birthdate AS userBirthdate, User.gender AS userGender
        FROM Purchase
        INNER JOIN Game ON Purchase.gameId = Game.id
        INNER JOIN User ON Purchase.userId = User.id
        WHERE Purchase.id = ?`;
    return db.get(query, [id]);
};
