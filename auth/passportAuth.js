/**
 * Created by Noman on 2/22/15.
 */
module.exports = function(passport, facebookStrategy, config, mongoose){

    var chatUser = new mongoose.Schema({
        profileID : String,
        fullName : String,
        profilePic: String
    });

    var userModel = mongoose.model('chatUsers', chatUser);

    passport.serializeUser(function(user, done){
       done(null, user.id);
    });

    passport.deserializeUser(function(id, done){

        userModel.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use(new facebookStrategy({

        clientID : config.fb.appID,
        clientSecret: config.fb.appSecret,
        callbackURL: config.fb.callbackURL,
        profileFields: ['id', 'displayName', 'photos']

    },function(accessToken, refreshToken, profile, done){

            //check the user exists in MongoDB
            // if not, create user in db and return the profile
            //if exists, simply return user profile

            userModel.findOne({'profileID':profile.id}, function(err, result){
                if(result){
                    done(null, result);
                }else{
                    var newChatUser = new userModel({
                        profileID : profile.id,
                        fullName : profile.displayName,
                        profilePic: profile.photos[0].value || ''
                    });
                    newChatUser.save(function(err){
                        done(null, newChatUser);
                    });
                }
            });
        }
    ));
}
