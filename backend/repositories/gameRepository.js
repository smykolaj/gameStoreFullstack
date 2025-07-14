const database = require('./database');

exports.getGames = async ({ limit, offset }) => {
    const db = await database;

    const query = `
        SELECT id, name, author, price
        FROM Game
        LIMIT ? OFFSET ?;
    `;
    return db.all(query, [limit, offset]);
};

exports.getTotalGamesCount = async () => {
    const db = await database;

    const query = `SELECT COUNT(*) as count FROM Game;`;
    const result = await db.get(query);
    return result.count;
};

exports.insertNewGame = async (data) => {
    const db = await database;
    const query = `
        INSERT INTO Game (name, author, price, releaseDate, genre)
        VALUES (?, ?, ?, ?, ?)`;
    return db.run(query, [data.name, data.author, data.price, data.releaseDate, data.genre]);
};

exports.existsById = async (id) => {
    const db = await database;

    const query = `SELECT 1 FROM Game WHERE id = ?`;
    const row = await db.get(query, [id]);
    return !!row;
};

exports.deleteGame = async (id) => {
    const db = await database;

    const query = `
        DELETE
        FROM Game
        WHERE id = ?`;
    return db.run(query, [id]);
};

exports.updateGame = async (data) => {
    const db = await database;

    const query = `
        UPDATE Game
        SET name = ?,
            author = ?,
            price = ?,
            releaseDate = ?,
            genre = ?
        WHERE id = ?`;
    const params = [data.name, data.author, data.price, data.releaseDate, data.genre, data.id];
    return db.run(query, params);
};

exports.getGame = async (id) => {
    const db = await database;

    const query = `
        SELECT Game.ID, Game.NAME, Game.AUTHOR, Game.PRICE, Game.RELEASEDATE, Game.GENRE
        FROM Game
        WHERE Game.ID = ?;`;
    return db.get(query, [id]);
};

exports.getGameAssociations = async (id) => {
    const db = await database;
    const query = `
    SELECT USER.Gender as gender, Purchase.purchaseDate as purchaseDate
    From Game
    INNER JOIN Purchase ON Game.Id = Purchase.gameId
    INNER JOIN User ON Purchase.userId = User.Id
    Where Game.ID = ?;`;

    return db.all(query, [id]);
};
