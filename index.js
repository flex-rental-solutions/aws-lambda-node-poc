const axios = require('axios');

exports.handler = async (event) => {

    let apiInfoResp = null;

    try {
        apiInfoResp = await axios.get('https://flex5dev.flexrentalsolutions.com/f5/api/info');
        //console.log(apiInfoResp.data);
    } catch (error) {
        console.error(error);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(apiInfoResp.data)
    };
    return response;
};