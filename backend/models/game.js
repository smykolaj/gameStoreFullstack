class Game {
    constructor({id,name, author, price, releaseDate, genre}) {
        this.id = id;
        this.name = name;
        this.author = author;
        this.price = price;
        this.releaseDate = releaseDate;
        this.genre = genre;
    }

    validate() {
        const errors = [];

        if (!this.name) errors.push("name_empty");
        if (!this.author) errors.push("author_empty");

        if (!this.releaseDate) {
            errors.push("releaseDate_empty");
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (! this.releaseDate.match(dateRegex)) {
                errors.push("releaseDate_invalid_format");
            } else {
                const releaseDate = new Date(this.releaseDate);

                if (isNaN(releaseDate.getTime())) {
                    errors.push("releaseDate_invalid_date");
                } else if (releaseDate >= new Date()) {
                    errors.push("releaseDate_future");
                }
            }
        }


        if (this.price == null) {
            errors.push("price_empty");
        } else if (this.price <= 0 || this.price > 999.99) {
            errors.push("price_invalid");
        }

        const validGenres = ['Action', 'RPG', 'Puzzle', 'Survival', 'Platformer'];
        if (!this.genre) {
            errors.push("genre_empty");
        } else if (!validGenres.includes(this.genre)) {
            errors.push("genre_invalid");
        }

        return errors;
    }
}
module.exports = Game;
