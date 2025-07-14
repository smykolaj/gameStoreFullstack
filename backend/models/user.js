class User {
    constructor({id, firstName, lastName, birthdate, email, password, role, gender}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.email = email;
        this.password = password;
        this.role = role;
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

        if (!this.gender) {
            errors.push("gender_empty");
        } else if (!['Male', 'Female', 'Other'].includes(this.gender)) {
            errors.push("gender_invalid");
        }

        if (!this.role) {
            errors.push("role_empty");
        } else if (!['Admin', 'User', 'Manager'].includes(this.role)) {
            errors.push("role_invalid");
        }

        return errors;
    }
}

module.exports = User;
