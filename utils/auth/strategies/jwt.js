const passport = require('passport')
const {Strategy, ExtractJwt} = require('passport-jwt');
const boom = require('@hapi/boom');

const userController= require('../../../controllers/userController');

passport.use(
    new Strategy({
        secretOrKey: process.env.AUTH_JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async function(tokenPayload, cb){
        try{
            const user = userController.getUser({email: tokenPayload.email }).data[0];

            if(!user){
                return cb(boom.unauthorized(), false);
            }

            delete user.password;

            cb(null,{...user, scopes: tokenPayload.scopes})

        }catch (error){
            return cb(error);
        }
    }
    )
)