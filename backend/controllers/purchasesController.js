const repository = require('../repositories/purchaseRepository');
const userRepository = require('../repositories/userRepository');
const gameRepository = require('../repositories/gameRepository');
const Purchase = require('../models/purchase');

const validateForeignKeysAndFetchData = async (purchase) => {
    const game = await gameRepository.getGame(purchase.gameId);
    const user = await userRepository.getUser(purchase.userId);

    if(!game){
        throw new Error("gameId_not_exist");
    }
    if(!user){
        throw new Error("userId_not_exist");
    }

    return { game, user };
};

exports.getAllPurchases = async (req, res) => {
    try {
        const { page = 1, limit = 7 } = req.query;
        const offset = (page - 1) * limit;

        const purchases = await repository.getPurchases({ limit, offset });
        const totalPurchases = await repository.getTotalPurchasesCount();

        res.status(200).json({
            data: purchases,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalPurchases / limit),
                totalPurchases,
                pageSize: parseInt(limit),
            },
        });
    } catch (err) {
        console.error("Error fetching purchases:", err);
        res.status(500).json({ errors: ["get_purchases_error"] });
    }
};

exports.postPurchase = async (req, res) => {
    try {
        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        const formData = req.body;
        const purchase = new Purchase(formData);
        const errors = purchase.validate();

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const { game, user } = await validateForeignKeysAndFetchData(purchase);

        if (new Date(game.releaseDate) > new Date(purchase.purchaseDate)) {
            return res.status(400).json({ errors: ["purchaseDate_earlier_release"] });
        }

        if (new Date(user.birthdate) > new Date(purchase.purchaseDate)) {
            return res.status(400).json({ errors: ["purchasDate_earlier_birth"] });
        }

        await repository.insertNewPurchase(purchase);
        res.status(200).send();
    } catch (err) {
        res.status(500).json({ errors: [err.message || "post_purchase_error"] });
    }
};

exports.deletePurchase = async (req, res) => {
    try {
        const formId = req.params.id;

        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({ errors: ["purchase_not_found"] });
        }

        const purchase = await repository.getPurchase(formId);

        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin") && (req.role !=="Manager")&&(req.user !== purchase.userId) ) {
            return res.status(403).json({errors: ["not_admin_or_owner"]});
        }


        await repository.deletePurchase(formId);
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting purchase:", err);
        res.status(500).json({ errors: ["delete_purchase_error"] });
    }
};

exports.patchPurchase = async (req, res) => {
    try {
        const formId = req.params.id;

        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({ errors: ["purchase_not_found"] });
        }
        const purchaseDb = await repository.getPurchase(formId);

        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin")&& (req.role !=="Manager") && (req.user !== purchaseDb.userId) ) {
            return res.status(403).json({errors: ["not_admin_or_owner"]});
        }


        const formData = req.body;
        const purchase = new Purchase(formData);
        const errors = purchase.validate();

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const { game, user } = await validateForeignKeysAndFetchData(purchase);

        if (new Date(game.releaseDate) > new Date(purchase.purchaseDate)) {
            return res.status(400).json({ errors: ["purchaseDate_earlier_release"] });
        }

        if (new Date(user.birthdate) > new Date(purchase.purchaseDate)) {
            return res.status(400).json({ errors: ["purchaseDate_earlier_birth"] });
        }

        purchase.id = formId;

        await repository.updatePurchase(purchase);
        res.status(200).send();
    } catch (err) {
        console.error("Error updating purchase:", err);
        res.status(500).json({ errors: [err.message] });
    }
};

exports.getPurchase = async (req, res) => {
    try {


        const formId = req.params.id;

        const exists = await repository.existsById(formId);

        if (!exists) {
            return res.status(404).json({ errors: ["purchase_not_found"] });
        }
        const purchase = await repository.getPurchase(formId);

        if ((req.role ==="Guest") || (!req.role)) {
            return res.status(403).json({errors: ["guest_need_login"]});
        }
        if ((req.role !=="Admin")&& (req.role !=="Manager") && (req.user !== purchase.userId) ) {
            return res.status(403).json({errors: ["not_admin_or_owner"]});
        }

        res.status(200).json(purchase);
    } catch (err) {
        console.error("Error fetching purchase:", err);
        res.status(500).json({ errors: ["get_purchase_error"] });
    }
};
