const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    
    const nameClaim = () => {
        let fileName = 'failureClaim' + Date.now() + '.txt';
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
    
    try {
        const record = JSON.parse(event.Records[0].body);
        const ref_id = record.REF_ID;
        //console.log(record);
        const params = {
                        Subject: 'Claim Failure Notification',
                        Message: `Please check the following Ref-Id(s) as they have not passed the automatic adjudication process\n ${ref_id}`,
                        TopicArn: 'arn:aws:sns:us-east-2:679253453712:capstone3-aa-failures'
                    };

                    // Create promise and SNS service object
                    const publishTextPromise = await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
                                
                    // Handle promise's fulfilled/rejected states
                    if (publishTextPromise) {
                        console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                        //console.log("MessageID is " + data.MessageId);
                    }
                    else {
                        console.log('Error');
                    }
        
    }
    catch (err) {
        console.log(err);
    }

};
