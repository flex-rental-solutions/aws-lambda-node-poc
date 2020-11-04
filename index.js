const axios = require('axios');

exports.handler = async (event) => {

    let apiInfoResp = null;

    let requestData = event;
    let flexJWT = requestData.flexJWT;
    let modelId = requestData.modelId

    let config = {
        headers: {
            "X-Auth-Token": flexJWT,
        }
    }

    try {
        apiInfoResp = await axios.get('https://flex5dev.flexrentalsolutions.com/f5/api/inventory-model/' + modelId, config);
        //console.log(apiInfoResp.data);
    } catch (error) {
        console.error(error);
    }

    try {
        //post to #lambda_posts channel
        let slackData = {
            "text": "AWS Lamba Data Post\n" + JSON.stringify(apiInfoResp.data)
        }

        let slackResp = await axios.post("https://hooks.slack.com/services/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", slackData);
    } catch (error) {
        console.error(error);
    }


    const response = {
        statusCode: 200,
        body: JSON.stringify(apiInfoResp.data)
    };
    return response;
};