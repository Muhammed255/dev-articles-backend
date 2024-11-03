import User from "../models/user.model.js";


export const tokenUpdateMiddleware = async (req, res, next) => {
  try {
    if (req.userData) { // Assuming you have middleware that sets userData
      const user = await User.findById(req.userData.userId);
      if (user && user.accessToken !== req.headers.authorization?.split(' ')[1]) {
        // If the token in the database differs from the request token
        res.set('New-Access-Token', user.accessToken);
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};