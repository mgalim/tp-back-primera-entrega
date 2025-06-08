import passport from 'passport';

export const authenticate = (type = 'api') => {
  return (req, res, next) => {
    return passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        if (type === 'view') {
          return res.redirect('/auth/login');
        }
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'No tienes permiso para acceder a este recurso' });
    }
    next();
  };
};
