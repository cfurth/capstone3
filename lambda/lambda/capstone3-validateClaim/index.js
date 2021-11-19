const AWS = require('aws-sdk');
const sql = require('mssql');

exports.handler = async (event) => {

    const sqlConfig = {
        user: 'admin',
        password: 'gb6L2047',
        database: 'capstone3',
        server: 'capstone3-db.cpfe54yosgvn.us-east-2.rds.amazonaws.com',
        port: 1433,
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    };

    const sendToSQS = async (data, queueName) => {
        const sqs = new AWS.SQS({
            apiVersion: "2012-11-05",
            endpoint: "sqs.us-east-2.amazonaws.com"

        });

        const params = {
            MessageAttributes: {
                "Title": {
                    DataType: "String",
                    StringValue: "capstone3 Claim Success"
                },
                "Author": {
                    DataType: "String",
                    StringValue: "capstone3-validateClaim"
                }
            },
            MessageBody: JSON.stringify(data),
            QueueUrl: queueName
        };
        try {
            await sqs.sendMessage(params).promise()
                .then(data => {
                    console.log("Successfully added message to queue", data.MessageId);
                })
        }
        catch (err) {
            console.log(err);
        }
    };

        try {
            let pool = await sql.connect(sqlConfig);
            let result = await pool.request()
                .query(`SELECT * from capstone3.dbo.claim`);
            pool.close();
            //console.log(result.recordset[0]['aa_pass']);
            const records = (result.recordset);
            for (i=0; i<records.length; i++) {
                //console.log(result.recordset[i]['aa_pass']);
                const record = result.recordset[i];
                const status = result.recordset[i]['aa_pass']
                if (status == 0) {
                    console.log('fail')
                    //console.log(record);                      
                    await sendToSQS(record, 'https://sqs.us-east-2.amazonaws.com/679253453712/claimFailure');

                }
                else if (status == 1) {
                    console.log('pass')
                    await sendToSQS(record, 'https://sqs.us-east-2.amazonaws.com/679253453712/claimSuccess');
                }
            }

        } catch (err) {
            console.error("ERROR: Exception thrown running SQL", err);
        }
};
