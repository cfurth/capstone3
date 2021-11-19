const AWS = require('aws-sdk');
const s3 = new AWS.S3();
//const xml2js = require('xml2js');
const parser = require('fast-xml-parser');
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

exports.handler = async (event) => {
  
 console.log("Looking S3 bucket");

  const getXML = async () => {
    //let result = 0;
    try {
      const srcBucket = event.Records[0].s3.bucket.name;//"capstone3-medical-claims" 
      const srcKey = event.Records[0].s3.object.key;//"17178E048025A135107007.xml" 
      console.log(srcBucket);
      console.log(srcKey);
      var params = {Bucket: srcBucket, Key: srcKey};
      const XML2JS = (await s3.getObject(params).promise()).Body.toString('utf-8');
      //console.log(XML2JS);
     // const responseData = XML2JS;
      console.log("XML2Json conversion");

      if( parser.validate(XML2JS) === true) {
        let jsonObj = parser.parse(XML2JS);
        //console.log(jsonObj);
        //jsonObj = JSON.stringify(jsonObj);
        //console.log(jsonObj);
        return jsonObj;
      }
      else {
        console.log('You messed up');
      }

    } catch (error) {
      console.log(error);      
    }
    return jsonObj;
  };
    
  try {
    const jsonOutput = await getXML();
    //const jsonOutputString = JSON.stringify(jsonOutput, null, 4);    
    //console.log(`This is the jsonOutput ${jsonOutputString}`);
    jsonOutput.MedicalClaim.Provider.Identifier = '00000'
    jsonOutput.MedicalClaim.Provider.TaxonomyCode = '00000'
    jsonOutput.MedicalClaim.Patient.State = 'NJ'
    jsonOutput.MedicalClaim.Header.ReferenceID = '000000000'
    //const aa_pass = 0;
    let sqlQuery = "INSERT INTO capstone3.dbo.CLAIM (SUBMTR_NM,RCVR_NM,REF_ID,SUBMT_TMSTP,PROV_NPI,TAX_ID,PAT_LST_NM,PAT_FRST_NM,PAT_ADDR,PAT_CITY,PAT_STATE_CD,PAT_ZIP_CD,PAT_BRTH_DT,CLM_ID,CLM_AMT,SVC_DT,PROC_CD,DIAG_CD, aa_pass) VALUES ('" + jsonOutput.MedicalClaim.Header.SubmitterName + "','" + jsonOutput.MedicalClaim.Header.ReceiverName + "','" + jsonOutput.MedicalClaim.Header.ReferenceID + "','" + jsonOutput.MedicalClaim.Header.SubmittedDateTime + "','" + jsonOutput.MedicalClaim.Provider.Identifier + "','" + jsonOutput.MedicalClaim.Provider.TaxonomyCode + "','" + jsonOutput.MedicalClaim.Patient.LastName + "','" + jsonOutput.MedicalClaim.Patient.FirstName + "','" + jsonOutput.MedicalClaim.Patient.Address + "','" + jsonOutput.MedicalClaim.Patient.City + "','" + jsonOutput.MedicalClaim.Patient.State + "','" + jsonOutput.MedicalClaim.Patient.ZipCode + "','" + jsonOutput.MedicalClaim.Patient.DateOfBirth + "','" + jsonOutput.MedicalClaim.Claim.Identifier + "','" + jsonOutput.MedicalClaim.Claim.ClaimAmount + "','" + jsonOutput.MedicalClaim.Claim.DateOfService + "','" + jsonOutput.MedicalClaim.Claim.ProcedureCode + "','" + jsonOutput.MedicalClaim.Claim.DiagnosisCode + "','" + '0' + "')"
      console.log(sqlQuery);
    var pool = await sql.connect(sqlConfig)
    var result = await pool.request()
      .query(sqlQuery)
      console.log('Row successfully inserted');
    pool.close();
  } catch (err) {
    console.log(err);
  }
};

/*@TODO convert data elements to variables like aa_pass

let sqlQuery = "INSERT INTO capstone3.dbo.CLAIM

(SUBMTR_NM, SubmitterName
  RCVR_NM, SubmitterName
  REF_ID, ReferenceID
  SUBMT_TMSTP, SubmittedDateTime

  PROV_NPI, Provider.Identifier
  TAX_ID, Provider.TaxonomyCode

  //PAT_ID, Provider.Name

  PAT_LST_NM, Patient.LastName
  PAT_FRST_NM, Patient.FirstName
  PAT_ADDR, Patient.Address
  PAT_CITY, Patient.City
  PAT_STATE_CD, Patient.State
  PAT_ZIP_CD, Patient.ZipCode
  PAT_BRTH_DT, Patient.DateOfBirth
  CLM_ID, Claim.Identifier
  CLM_AMT, Claim.ClaimAmount
  SVC_DT, .Claim.DateOfService
  PROC_CD, Claim.ProcedureCode
  DIAG_CD) Claim.DiagnosisCode
  */
