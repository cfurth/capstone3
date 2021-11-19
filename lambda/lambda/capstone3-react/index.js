const sql = require('mssql');

// config for database
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

exports.handler = async (event, context, callback) => {
    
    try {
        let sqlQuery = "SELECT REF_ID as id, SUBMT_TMSTP,  PAT_FRST_NM + ' ' + PAT_LST_NM as 'FULL_NAME', CLM_AMT, SVC_DT, AA_PASS from capstone3.dbo.CLAIM";
          //console.log(sqlQuery);
        var pool = await sql.connect(sqlConfig);
        var result = await pool.request()
          .query(sqlQuery);
          console.log(result);
        pool.close();
    } catch (err) {
        console.log(err);
    }
        
        /*if (typeof data.REF_ID === 'undefined') {
            return sendRes(404, '{ error: true, message: "Hello World!." }');
        }*/
        
        return sendRes(200, result.recordset);
    }    
    
    //return sendRes(404, '{ "error": true, "message": "' + "'Hey Naga'" + '" }');
    
const sendRes = (status, body) => {
    var response = {
        statusCode: status,
        headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin" : "*",
            "X-Requested-With" : "*"
        },
        body: body
    };
    return response;
};