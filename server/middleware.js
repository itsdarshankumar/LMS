//auth middleware
export function userauth(req, res, next) {
  if (req.session.userinfo && req.session.userrole === 0) {
    return next();
  } else {
    res.send("Not Allowed");
  }
}

export function adminauth(req, res, next) {
  if (req.session.userinfo && req.session.userrole === 1) {
    return next();
  } else {
    res.send("Not Allowed");
  }
}
