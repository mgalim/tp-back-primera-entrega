import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/user.js';
import { env } from './env.js';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (jwtPayload, done) => {
    try {
      const userDoc = await User.findById(jwtPayload.id);
      if (!userDoc) {
        return done(null, false); // o manejar el error como corresponda
      }

      const { password, ...user } = userDoc.toObject(); // O userDoc si no usás .toObject()
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
