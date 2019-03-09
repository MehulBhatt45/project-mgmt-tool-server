var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;
var UserSchema = new Schema({

    fname:  String,
    lname: String,
    name:  String,
    userRole: {type:String, default: 'user'},
    email: {type:String},
    password: String,
    joiningDate: Date,
    phone: String,
    experience:String,
    profilePhoto: String,
    CV: String,
    projects:[{type:Schema.Types.ObjectId, ref: 'Project'}],
    tasks: [{type: Schema.Types.ObjectId , ref: 'Tasks'}]
},{timestamps: true});


UserSchema.pre('save', function(next) {
    var user = this;
    console.log("=====================>", user);
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            console.log(hash);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User',UserSchema);
