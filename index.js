const axios = require('axios');

exports.handler = async (event) => {

    //This function is a super primitive ETL function running on AWS Lambda. What it does:
    // 1) Pull JSON Data from Flex
    // 2) Post the JSON to the Flex #lambda_posts channel

    let apiInfoResp = null;
    let requestData = event.body ? JSON.parse(event.body) : event;
    let flexJWT = requestData.flexJWT;
    let flexTargetGuid = requestData.flexTargetGuid
    let flexBaseURL = requestData.flexBaseURL
    let eventType = requestData.eventType
    let slackPostUrl = process.env.slack_post_url
    let imageURL = null

    let config = {
        headers: {
            "X-Auth-Token": flexJWT,
        }
    }

    //EXTRACT the data
    try {
        switch (eventType){
            case "inventory-model":
                apiInfoResp = await axios.get(flexBaseURL + '/f5/api/inventory-model/' + flexTargetGuid, config);
                imageURL = await axios.get(flexBaseURL + '/f5/api/inventory-model/' + flexTargetGuid + '/imageUrl', config).data
                break;
            case "contact":
                apiInfoResp = await axios.get(flexBaseURL + '/f5/api/contact/' + flexTargetGuid, config);
                imageURL = "Not Implemented";
                break;
        }
    } catch (error) {
        console.error(error);
    }

    //TRANSFORM the data - no transformation of data in this POC

    //LOAD the data
    try {
        //post to #lambda_posts channel
        let slackData = {
            "text": "AWS Lambda Data Post\n" +
                "Flex Data Source: " + flexBaseURL +
                "\nEvent Type: " + eventType +
                "\nImage URL: " + JSON.stringify(imageURL) +
                "\n\n" + JSON.stringify(apiInfoResp.data)
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