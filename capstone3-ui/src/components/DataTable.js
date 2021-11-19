import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'Claim Id', width: 170 },
  { field: 'SUBMT_TMSTP', headerName: 'Sumbit Date', width: 200 },
  { field: 'FULL_NAME', headerName: 'Full Name', description: 'This column has a value getter and is not sortable.', sortable: false, width: 170,
  valueGetter: (params) =>
    `${params.getValue(params.id, 'FRST_NM') || ''} ${
      params.getValue(params.id, 'LST_NM') || ''
    }`,
},
  { field: 'CLM_AMT', headerName: 'Claim Value', type: 'number', width: 200 },
  { field: 'SVC_DT', headerName: 'Service Date', width: 200 },
  { field: 'AA_PASS', headerName: 'Status', type: 'number', width: 200 }
];

const rows = [
  { id: 1, LST_NM: 'Snow', FRST_NM: 'Jon', SUBMT_TMSTP: '10/01/2021', CLM_AMT: 247.43, SVC_DT: '10/02/2021', AA_PASS: 0 },
  { id: 2, LST_NM: 'Lannister', FRST_NM: 'Cersei', SUBMT_TMSTP: '11/02/2021', CLM_AMT: 834.13, SVC_DT: '11/03/2021', AA_PASS: 1 },
  { id: 3, LST_NM: 'Lannister', FRST_NM: 'Jaime', SUBMT_TMSTP: '10/10/2021', CLM_AMT: 234.43, SVC_DT: '10/11/2021', AA_PASS: 1 },
  { id: 4, LST_NM: 'Stark', FRST_NM: 'Arya', SUBMT_TMSTP: '10/03/2021', CLM_AMT: 634.97, SVC_DT: '10/04/2021', AA_PASS: 0 },
  { id: 5, LST_NM: 'Targaryen', FRST_NM: 'Daenerys', SUBMT_TMSTP: '09/05/2021', CLM_AMT: 200.00, SVC_DT: '09/06/2021', AA_PASS: 0 },
  { id: 6, LST_NM: 'Melisandre', FRST_NM: 'Rob', SUBMT_TMSTP: '10/23/2021', CLM_AMT: 114.43, SVC_DT: '10/24/2021', AA_PASS: 1 },
  { id: 7, LST_NM: 'Clifford', FRST_NM: 'Ferrara', SUBMT_TMSTP: '08/08/2021', CLM_AMT: 242.03, SVC_DT: '08/09/2021', AA_PASS: 0 },
  { id: 8, LST_NM: 'Frances', FRST_NM: 'Rossini', SUBMT_TMSTP: '11/01/2021', CLM_AMT: 614.46, SVC_DT: '11/02/2021', AA_PASS: 1 },
  { id: 9, LST_NM: 'Roxie', FRST_NM: 'Harvey', SUBMT_TMSTP: '10/06/2021', CLM_AMT: 264.91, SVC_DT: '10/07/2021', AA_PASS: 0 }
];

export default function DataTable() {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid 
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        //checkboxSelection
        />
      )
    </div>
  );
}
