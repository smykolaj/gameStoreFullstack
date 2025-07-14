class Purchase {
    constructor({id, userId, gameId, purchaseDate, currency}) {
        this.id = id;
        this.userId = userId;
        this.gameId = gameId;
        this.purchaseDate = purchaseDate;
        this.currency = currency;
    }

    validate() {
        const errors = [];

        if (!this.userId) errors.push("userId_empty");
        if (!this.gameId) errors.push("gameId_empty");

        if (!this.purchaseDate) {
            errors.push("purchaseDate_empty");
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!this.purchaseDate.match(dateRegex)) {
                errors.push("purchaseDate_invalid_format");
            } else {
                const purchaseDate = new Date(this.purchaseDate);

                if (isNaN(purchaseDate.getTime())) {
                    errors.push("purchaseDate_invalid_date");
                } else if (purchaseDate >= new Date()) {
                    errors.push("purchaseDate_future");
                }
            }
        }


        const validCurrencies = ['USD', 'EUR', 'PLN', 'GBP'];
        if (!this.currency) {
            errors.push("currency_empty");
        } else if (!validCurrencies.includes(this.currency)) {
            errors.push("currency_invalid");
        }

        return errors;
    }
}
module.exports = Purchase;
