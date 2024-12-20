const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('./../utils/appError')

const signToken = id => {
    return jwt.sign({id : id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRES_IN});
}

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);

    console.log(token);
  
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      )    
    });

    res.once('finish', () => {
      const setCookieHeader = res.get('Set-Cookie');
      console.log('Set-Cookie header:', setCookieHeader);
    });

  
    user.password = undefined;
  
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

exports.signup = async (req, res) => {

    try{
        const newUser = await User.create({
            name : req.body.name,
            email : req.body.email,
            username : req.body.username,
            phone : req.body.phone,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm
        });

        createSendToken(newUser, 201, req, res);
    } catch (err) {
        res
        .status(400)
        .json({
            status : 'fail',
            message : err
        });
    }

};

exports.login = async (req, res, next) => {

    try{
        
        const {email, password} = req.body;

        if(!email || !password)
        {
            return next(new AppError('Please provide email and passsword', 400));
        }

        const user = await User.findOne({email : email}).select('+password');
        
        if(!user || !(await user.correctPassword(password, user.password)))
        {
            return next(new AppError('Incorrect Email or Password', 401));
        }

        createSendToken(user, 200, req, res);

    } catch (err) {
        console.log(err);
        res
        .status(400)
        .json({
            status : 'fail',
            message : err
        });
    }

};

exports.protect = async (req, res, next) => {

    let token;

    try {

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        console.log(token);

        if(!token) {
            next(new AppError('Not logged in', 401));
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        console.log(decoded);

        const freshUser = await User.findById(decoded.id);

        if(!freshUser) {
            next(new AppError('User not found', 401));
        }

        if(freshUser.changePasswordAfter(decoded.iat)) {
            return next(new AppError('Login Again', 401));
        }

        req.user = freshUser;

        next();

    } catch(err) {
        console.log(err);
    }

}

exports.isLoggedIn = async (req, res, next) => {

    console.log(req.cookies);

    if (req.cookies.jwt) {

      try {
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );

        console.log(decoded);
  
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }

        console.log(currentUser);
  
        // if (currentUser.changedPasswordAfter(decoded.iat)) {
        //   return next();
        // }
  
        res.locals.user = currentUser;

        console.log('user : ');
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

  exports.logout = async (req, res, next) => {

    if (req.cookies.jwt) {

      console.log('Hello');
      try {
        res.clearCookie('jwt');
        return res.send('Logout successful');
  
      } catch (err) {
        console.error('Error during logout:', err);
          return res.status(500).send('An error occurred while logging out');
      }
    } else {
      return res.status(400).send('No active session to log out from');
    }
  };
  