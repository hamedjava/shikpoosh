class User {
    constructor(id, name, email, phone, role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
    }

    updateName(newName) {
        this.name = newName;
    }

    updateEmail(newEmail) {
        this.email = newEmail;
    }

    updatePhone(newPhone) {
        this.phone = newPhone;
    }

    isAdmin() {
        return this.role === "admin";
    }
}

module.exports = User;
