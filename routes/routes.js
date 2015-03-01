/**
 * Created by Noman on 2/15/15.
 */
module.exports = function(express, app, passport, config, rooms){

    var router = express.Router();

    router.get('/', function(req, res, next){
        res.render('index', {title: 'Welcome to ChatCAT'});
    });

    router.get('/auth/facebook', passport.authenticate('facebook'));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/chatrooms',
        failureRedirect: '/'
    }));

    function securePages(req, res, next){
        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect('/');
        }
    }

    router.get('/chatrooms',securePages, function(req, res, next){
        res.render('chatrooms', {title: 'Chatrooms', user:req.user, config:config});
    });

    router.get('/room/:id', securePages, function(req, res, next){
        var room_det = getRoomDetail(req.params.id);
        res.render('room', {room_name: room_det.room_name, user:req.user, room_number:room_det.room_number, config:config});
    });

    function getRoomDetail(room_number){
        var n =0;
        while(n<rooms.length){
            if(rooms[n].room_number == room_number) {
                return rooms[n];
                break;
            }
            n++;
        }
        return false;
    }

    router.get('/logout', function(req, res, next){
        req.logOut();
    });

    router.get('/setcolor', function(req, res, next){
        req.session.favColor = "Red";
        res.send('seeting the fav color!!');
    });

    router.get('/getcolor', function(req, res, next){
        res.send('fav color is : ' + (req.session.favColor === 'undefined'? "Not found" : req.session.favColor));

    });

    app.use('/', router);

}
