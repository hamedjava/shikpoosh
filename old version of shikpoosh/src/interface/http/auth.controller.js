const authService = require('../../domain/services/auth.service');

exports.loginController = async (req, res) => {
  const user = req.user; // فرض می‌کنیم احراز هویت OTP شده
  const { accessToken, refreshToken } = await authService.login(user);
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false, // در dev باید false باشه
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ accessToken });
};

exports.refreshController = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const newAccessToken = await authService.refreshToken(token);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

exports.logoutController = async (req, res) => {
  const token = req.cookies.refreshToken;
  await authService.logout(token);
  res.clearCookie('refreshToken');
  res.sendStatus(204);
};

exports.logoutAllController = async (req, res) => {
  const userId = req.user.id;
  await authService.logoutAllDevices(userId);
  res.sendStatus(204);
};
