/**
 * @param {...string} roles نقش‌هایی که مجاز هستند
 */
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'شما مجوز دسترسی به این بخش را ندارید.' });
    }

    next();
  };
};

module.exports = authorizeRole;
