exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda and Github and Roger!! Whoa!!! :::' + event.msg),
    };
    return response;
};