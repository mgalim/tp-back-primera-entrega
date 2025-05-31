import passport from 'passport';

export const authenticate = passport.authenticate('jwt', { session: false });

export const authorize = (...roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para acceder a este recurso' });
    }
    next();
  };
};
