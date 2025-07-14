const repository = require('../repositories/gameRepository');
const Game = require('../models/game');

exports.getAllGames = async (req, res) => {
    try {
        const { page = 1, limit = 7 } = req.query;
        const offset = (page - 1) * limit;

        const games = await repository.getGames({ limit, offset });
        const totalGames = await repository.getTotalGamesCount();

        res.status(200).json({
            data: games,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalGames / limit),
                totalGames,
                pageSize: parseInt(limit),
            },
        });
    } catch (err) {
        console.error("Error fetching games:", err);
        res.status(500).json({ errors: ["get_games_error"] });
    }
};


exports.postGame = async (req, res) => {
    try {
        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        const formData = req.body;
        const game = new Game(formData);
        const errors = game.validate();

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        await repository.insertNewGame(game);
        res.status(200).send();
    } catch (err) {
        console.error("Error inserting new game:", err);
        res.status(500).json({ errors: ["insert_game_error"] });
    }
};

exports.deleteGame = async (req, res) => {
    try {
        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin") && (req.role !=="Manager") ) {
            return res.status(403).json({errors: ["not_admin"]});
        }
        const formId = req.params.id;
        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({ errors: ["game_not_found"] });
        }

        await repository.deleteGame(formId);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting game:", err);
        res.status(500).json({ errors: ["delete_game_error"] });
    }
};

exports.patchGame = async (req, res) => {
    try {
        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin") && (req.role !=="Manager") ) {
            return res.status(403).json({errors: ["not_admin"]});
        }
        const formId = req.params.id;
        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({ errors: ["game_not_found"] });
        }

        const formData = req.body;
        const game = new Game(formData);
        const errors = game.validate();

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        game.id = formId;

        await repository.updateGame(game);
        res.status(200).send();
    } catch (err) {
        console.error("Error updating game:", err);
        res.status(500).json({ errors: ["update_game_error"] });
    }
};

exports.getGame = async (req, res) => {
    try {
        const formId = req.params.id;
        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({ errors: ["game_not_found"] });
        }

        const gameData = await repository.getGame(formId);
        const buyers = await repository.getGameAssociations(formId);
        console.log(buyers);
        const buyersData = analyzeBuyers(buyers);

        const game = {
            ...gameData,
            buyersData
        };
        console.log(game)

        res.status(200).json(game);
    } catch (err) {
        console.error("Error fetching game:", err);
        res.status(500).json({ errors: ["get_game_error"] });
    }
};

const analyzeBuyers = (buyers) => {
    if (!buyers || buyers.length === 0) {
        return {
            lastPurchaseDate: null,
            totalPurchases: 0,
            mostFrequentGender: null,
        };
    }

    let lastPurchaseDate = new Date(buyers[0].purchaseDate);
    const genderCounts = {};
    let totalPurchases = buyers.length;

    buyers.forEach((buyer) => {
        // Update last purchase date
        const purchaseDate = new Date(buyer.purchaseDate);
        console.log(purchaseDate)
        if (purchaseDate > lastPurchaseDate) {
            lastPurchaseDate = purchaseDate;
        }

        // Count gender occurrences
        const gender = buyer.gender;
        if (genderCounts[gender]) {
            genderCounts[gender]++;
        } else {
            genderCounts[gender] = 1;
        }
    });

    // Find the most frequent gender
    let mostFrequentGender = null;
    let maxCount = 0;
    for (const gender in genderCounts) {
        if (genderCounts[gender] > maxCount) {
            maxCount = genderCounts[gender];
            mostFrequentGender = gender;
        }
    }


    const latestPurchase = `${lastPurchaseDate.getFullYear()}-${lastPurchaseDate.getMonth()+1}-${lastPurchaseDate.getDate()}`


    return {
        latestPurchase,
        totalPurchases,
        mostFrequentGender,
    };
};
