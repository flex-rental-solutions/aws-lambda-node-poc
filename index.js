const axios = require('axios');

exports.handler = async (event) => {

    let apiInfoResp = null;

    let requestData = JSON.parse(event.body);
    let flexJWT = requestData.flexJWT;
    let modelId = requestData.modelId

    axios.defaults.headers.common['X-Auth-Token'] = flexJWT // for all requests

    try {
        apiInfoResp = await axios.get('https://flex5dev.flexrentalsolutions.com/f5/api/inventory-model/' + modelId);
        //console.log(apiInfoResp.data);
    } catch (error) {
        console.error(error);
    }

    try {
        let slackData = {"text" : JSON.stringify(apiInfoResp.data)};
        //post to #lambda_posts channel
        let slackResp = await axios.post("https://hooks.slack.com/services/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", slackData);
        //console.log(slackResp.data);
    } catch (error) {
        console.error(error);
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify(apiInfoResp.data)
    };
    return response;
};