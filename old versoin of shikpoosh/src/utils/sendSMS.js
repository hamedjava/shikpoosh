const Kavenegar = require('kavenegar');

const api = Kavenegar.KavenegarApi({
  apikey: 'apikey_خودت_اینجا', // 🔒 کلید API از پنل Kavenegar
});

const sendOTP = (phoneNumber, code) => {
  return new Promise((resolve, reject) => {
    api.Send({
      message: `کد ورود شما: ${code}`,
      sender: '10004346', // یا شماره اختصاصی ارسال پیامک از پنل
      receptor: phoneNumber,
    }, function(response, status) {
      if (status === 200) resolve(response);
      else reject(response);
    });
  });
};

module.exports = sendOTP;
