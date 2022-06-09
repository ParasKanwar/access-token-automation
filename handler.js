'use strict';
const { getAccessToken } = require('./getAccessToken');

module.exports.hello = async (event) => {
  const url = await getAccessToken();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: url,
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
