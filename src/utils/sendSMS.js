// sendSMS.js
const Kavenegar = require('kavenegar');

const api = Kavenegar.KavenegarApi({
  apikey: 'apikey خودت رو اینجا بذار',
});

const sendOTP = (phoneNumber, code) => {
  return new Promise((resolve, reject) => {
    api.Send({
      message: `کد ورود شما: ${code}`,
      sender: '10004346',
      receptor: phoneNumber,
    }, function(response, status) {
      if (status === 200) resolve(response);
      else reject(response);
    });
  });
};

module.exports = sendOTP;
