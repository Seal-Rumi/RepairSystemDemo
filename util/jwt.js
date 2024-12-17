// Nodejs encryption with CTR 
const jwt = require('jsonwebtoken');
const secret_key = 'my_secret_key';

function encrypt(payload) {
    // const valid_intv = 60 * 60 * 24 * 7;
    const token = jwt.sign({ payload }, secret_key);
    var result = (Object.assign({ code: 200 }, { message: '登入成功', token }));
    return result;
}

function decrypt(token) {
    try {
        var result = jwt.verify(token, secret_key);
        return { success: true, result };
    } catch (err) {
        return { success: false }
    }
}

const payload = {
    user_id: '',
    user_name: "danhai",
    user_type: 1
};

// console.log(encrypt(payload));

exports.encode = (data) => {
    return encrypt(data);
}

exports.decode = (token) => {
    return decrypt(token);
}

exports.ptk_encode = ({ payload = {}, secret_key }) => {
    // 限時30分鐘
    return jwt.sign({ payload }, secret_key, { expiresIn: 60 * 30 });
}

exports.ptk_decode = (tk, ky) => {
    try {
        var result = jwt.verify(tk, ky);
        return { success: true, result };
    } catch (err) {
        console.log(err);
        
        return { success: false }
    }
}