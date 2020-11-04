exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        body: JSON.parse(event.body).msg
    };
    return response;
};