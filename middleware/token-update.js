import User from "../models/user.model.js";


export const tokenUpdateMiddleware = async (req, res, next) => {
  try {
		if (!req.userData?.userId) {
      return next();
    }
    const user = await User.findById(req.userData.userId);
    const currentToken = req.headers.authorization?.split(' ')[1];

    if (user && user.accessToken && user.accessToken !== currentToken) {
      // If the token in the database differs from the request token
      res.set('New-Access-Token', user.accessToken);
    }
    next();
  } catch (error) {
    next(error);
  }
};