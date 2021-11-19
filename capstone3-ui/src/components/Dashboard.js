import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import './Dashboard.css';


const columns = [
    { field: 'id', headerName: 'Claim ID', width: 170 },
    { field: 'SUBMT_TMSTP', headerName: 'Sumbit Date', width: 200 },
    { field: 'FULL_NAME', headerName: 'Full Name', width: 200  },
    { field: 'CLM_AMT', headerName: 'Claim Value', width: 200 },
    { field: 'SVC_DT', headerName: 'Service Date', width: 200 },
    { field: 'AA_PASS', headerName: 'Status', type: 'number', width: 200 }
  ];
   /* 
  [
    {"id":"000000000","SUBMT_TMSTP":"2019-04-23T00:00:00.000Z","FULL_NAME":"DOROTHY JONES","CLM_AMT":236,"SVC_DT":"2019-04-18T00:00:00.000Z","AA_PASS":0},
    {"id":"19113E024103100050013","SUBMT_TMSTP":"2019-04-23T00:00:00.000Z","FULL_NAME":"DOROTHY JONES","CLM_AMT":236,"SVC_DT":"2019-04-18T00:00:00.000Z","AA_PASS":0},
    {"id":"19119E02427334531617","SUBMT_TMSTP":"2019-04-29T00:00:00.000Z","FULL_NAME":"DEBORAH PATEL","CLM_AMT":120,"SVC_DT":"2019-04-24T00:00:00.000Z","AA_PASS":0}
   ]
*/


class Dashboard extends React.Component {

    state = { rowData: [] }

    componentDidMount () {
        //api is invoke url for API Gateway
        const api = 'https://zpu6t5heel.execute-api.us-east-2.amazonaws.com/staging';
        axios
        .get(api)
        .then((response) => {
            let rowArray = response.data.body;            
            this.setState({ rowData: rowArray })
        })
        .catch((error) => {
            console.log(error);
        });
    };
        
        

    render() {
        return (
        <div className="Dashboard">
            <h1>Active Claims</h1>
            <div style={{ height: 700, width: '100%', backgroundColor: '#f6fcfe' }}>
            <DataGrid 
                getRowId={(row) => row.id}
                id='id'
                rows={this.state.rowData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                //checkboxSelection
                />
            </div>
        </div>
        )
    }
};

export default Dashboard;