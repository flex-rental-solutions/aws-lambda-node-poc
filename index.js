const axios = require('axios');

exports.handler = async (event) => {

    let apiInfoResp = null;

    let requestData = event.body ? JSON.parse(event.body) : event;
    let flexJWT = requestData.flexJWT;
    let flexTargetGuid = requestData.flexTargetGuid
    let flexBaseURL = requestData.flexBaseURL
    let eventType = requestData.eventType
    let slackPostUrl = process.env.slack_post_url

    let config = {
        headers: {
            "X-Auth-Token": flexJWT,
        }
    }

    try {
        switch (eventType){
            case "inventory-model":
                apiInfoResp = await axios.get(flexBaseURL + '/f5/api/inventory-model/' + flexTargetGuid, config);
                break;
            case "contact":
                apiInfoResp = await axios.get(flexBaseURL + '/f5/api/contact/' + flexTargetGuid, config);
                break;
        }
    } catch (error) {
        console.error(error);
    }

    try {
        //post to #lambda_posts channel
        let slackData = {
            "text": "AWS Lamba Data Post\nFlex Data Source: " + flexBaseURL + "\nEvent Type:" + eventType + "\n\n" + JSON.stringify(apiInfoResp.data)
        }

        let slackResp = await axios.post(slackPostUrl, slackData);
    } catch (error) {
        console.error(error);
    }


    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: "ETL Action complete for '" + eventType + "' and flexTargetGuid " + flexTargetGuid
    };
    return response;
};