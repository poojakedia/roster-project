import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Tooltip } from 'react-tooltip'
import Button from 'react-bootstrap/Button';


function Table(){
    const [rows, setRows] = useState([{_id:"",firstName:"", lastName:"", major:"",gradYear:""}]);
    const [editRow, setEditRow] = useState(null);

    const handleEdit = (row) => {
        setEditRow(row._id);
    }
    

    const handleDelete = async(row)=>{
        try{
            const resp = await fetch('http://127.0.0.1:5000/delete', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }, body: JSON.stringify(row)
        
            })
            const result = await resp.json();
            window.location.reload();

            return result;
            
        }
        catch(err){
            console.log("Failed deleting user: ",err);
        }

    }

    const handleSave = async(row) =>{
            console.log(JSON.stringify(row));
            try{
                const resp = await fetch('http://127.0.0.1:5000/update', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(row)
            
                })
                const result = await resp.json();
                console.log("Server response:", result);
                setEditRow(null);
                return result;
                
            }
            catch(err){
                console.log("Failed updating user: ",err);
            }
    
        
    
    
    };

    const columns = [
        {
            name: "First Name",
            selector: row => row.firstName,
            cell: (row) =>
                editRow === row._id ? (
                    <input
                    type="text"
                    value={row.firstName}
                    onChange = {(e)=>{
                        
                        setRows((prev)=>
                            prev.map((elem) => 
                                elem._id === row._id ?
                        ({...row, firstName: e.target.value }): elem));

                    }}
                    />
                ) : (
                    row.firstName
                ),
        },
        {
            name: "Last Name",
            selector: row => row.lastName,
            cell: (row) =>
                editRow === row._id ? (
                    <input
                    type="text"
                    value={row.lastName}
                    onChange = {(e)=>{
                        
                        setRows((prev)=>
                            prev.map((elem) => 
                                elem._id === row._id ?
                        ({...row, lastName: e.target.value }): elem));

                    }}
                    />
                ) : (
                    row.lastName
                ),
        },
        {
            name: "Major",
            selector: row => row.major,
            cell: (row) =>
                editRow === row._id ? (
                    <input
                    type="text"
                    value={row.major}
                    onChange = {(e)=>{
                        
                        setRows((prev)=>
                            prev.map((elem) => 
                                elem._id === row._id ?
                        ({...row, major: e.target.value }): elem));

                    }}
                    />
                ) : (
                    row.major
                ),
        },
        {
            name: "Class Year",
            selector: row => row.gradYear,
            cell: (row) =>
                editRow === row._id ? (
                    <input
                    type="text"
                    value={row.gradYear}
                    onChange = {(e)=>{
                        
                        setRows((prev)=>
                            prev.map((elem) => 
                                elem._id === row._id ?
                        ({...row, gradYear: e.target.value }): elem));

                    }}
                    />
                ) : (
                    row.gradYear
                ),
        },{
            cell: (row) => (
                <>
                

                {(editRow && editRow === row._id) ? (<Button onClick={()=>
                    handleSave(row)} style={{color: "beige"}}> 💾 </Button>):( <Button onClick={()=> handleEdit(row)} style={{color: "beige"}}> 🖊️ </Button>
                )}
                <Button onClick={()=>{
                    handleDelete(row);
                }} style={{color: "beige"}}> ❌ </Button>
                </>
            )
        },
        {

        }

    ]
    


    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const resp = await fetch('http://127.0.0.1:5000/read');
                if (!resp.ok){
                    throw new Error(`Error: ${resp.status}`);
                }
                const result = await resp.json();
                console.log(result);
                setRows(result);
            } catch(err){
                console.log(err.message);
            }
            
        }
        fetchData();
    },[]); //runs when the component is mounted
    return(
    <div className = "container">
        <DataTable 
        columns={columns} 
        data={rows} 
        pagination
        //title="Student Directory"
        keyField="_id"
        />
        
    </div>
    );
}
export default Table;