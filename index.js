exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda and Github and Roger!! Whoa!!! ::: Event Msg:' + event.body.msg),
    };
    return response;
};