class UserEntity {
    constructor({ name, phoneNumber, email, password, role }) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.password = password;
        this.role = role || 'customer';
    }
}

module.exports = UserEntity;
