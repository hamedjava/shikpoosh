const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // بررسی وجود توکن
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'توکن وجود ندارد یا معتبر نیست.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // اطلاعات داخل توکن (مثلاً phoneNumber)
    next();
  } catch (err) {
    return res.status(403).json({ message: 'دسترسی غیرمجاز یا توکن منقضی شده است.' });
  }
};

module.exports = authMiddleware;
