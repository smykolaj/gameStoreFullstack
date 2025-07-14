class User {
    constructor({id, firstName, lastName, birthdate, email, password, gender, repeatPassword}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
        this.repeatPassword = repeatPassword;
        this.gender = gender;
    }

    validate() {
        const errors = [];

        if (!this.firstName) errors.push("firstName_empty");
        if (!this.lastName) errors.push("lastName_empty");

        if (!this.birthdate) {
            errors.push("birthdate_empty");
        } else {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (!this.birthdate.match(dateRegex)) {
                errors.push("birthdate_invalid_format");
            } else {
                const birthdate = new Date(this.birthdate);

                if (isNaN(birthdate.getTime())) {
                    errors.push("birthdate_invalid_date");
                } else if (birthdate >= new Date()) {
                    errors.push("birthdate_future");
                } else if (birthdate.getFullYear() < 1900) errors.push("birthdate_too_old");
            }
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email) {
            errors.push("email_empty");
        } else if (!this.email.match(emailRegex)) {
            errors.push("email_invalid");
        }

        const passwordRegex =/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{8,}$/;
        if (!this.password) {
            errors.push("password_empty");
        } else if (!this.password.match(passwordRegex)) {
            errors.push("password_weak");
        }

        if (!this.repeatPassword) {
            errors.push("repeatPassword_empty");
        } else if (this.repeatPassword !== (this.password)) {
            errors.push("repeatPassword_not_same");
        }

        if (!this.gender) {
            errors.push("gender_empty");
        } else if (!['Male', 'Female', 'Other'].includes(this.gender)) {
            errors.push("gender_invalid");
        }


        return errors;
    }
}
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

export {User,Purchase,Game }