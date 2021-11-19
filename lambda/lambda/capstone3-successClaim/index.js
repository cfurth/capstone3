const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    
    const nameClaim = () => {
        let fileName = 'successClaim' + Date.now() + '.txt';
        console.log(`Before toString: ${fileName}`);
        fileName = (fileName).toString();
        console.log(`After toString: ${fileName}`);
        
        return fileName;
    };
    
    try {
        const desinationBucket = 'capstone3-processed-claim-data'; //process.env.bucketName
        const key = nameClaim(); //process.env.key
        const record = event.Records[0].body;
        
        console.log(desinationBucket);
        console.log(key);

        var params = {Body: record, Bucket: desinationBucket, Key: key};


        await s3.putObject(params).promise();
    }
    catch (err) {
        console.log(err);
    }

};
