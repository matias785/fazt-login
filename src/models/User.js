const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true},
    date: { type: Date, Default: Date.now  }
});


UserSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hast = bcrypt.hash(password, salt);
    return hast;  
};

UserSchema.methods.matchPassword = async function (password)  {
    return await bcrypt.compare(password, this.password); 
}

module.exports =  mongoose.model('User', UserSchema);