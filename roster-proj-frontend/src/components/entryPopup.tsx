import React, { useState, useEffect } from "react";
import Popup from 'reactjs-popup';

function EntryPopup(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [major, setMajor] = useState("");
    const [gradYear, setGradYear] = useState("");

    const handleCreate =async()=>{
        try{
            const resp = await fetch('http://127.0.0.1:5000/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                firstName:firstName,
                lastName:lastName,
                gradYear:gradYear,
                major:major
            })
        
            })
            const result = await resp.json();
            window.location.reload();
            setFirstName("");
            setLastName("");
            setMajor("");
            setGradYear("");

            return result;
            
        }
        catch(err){
            console.log("Failed creating user: ",err);
        }
    }
    return(
        <div>
            <Popup trigger={<button>Add Student</button>} position="top right" modal nested>{
            <div className="formContainer" style={{backgroundColor:"beige", height: "300px", width: "450px", display: "flex", alignContent: "center", justifyContent:"center"}}>
            <form style={{marginTop:"75px"}}>
            <div>
            <label>First Name:
                <input type="text" 
                value={firstName}
                onChange={(e)=>setFirstName(e.target.value)}
                />
            </label>
            </div>
            <div>
            <label>Last Name:
                <input type="text" 
                value={lastName}
                onChange={(e)=>setLastName(e.target.value)}
                />
            </label>
            </div>
            <div>
            <label>Major:
                <input type="text" 
                value={major}
                onChange={(e)=>setMajor(e.target.value)}
                />
            </label>
            </div>
            <div>
            <label>Grad Year:
                <input type="text" 
                value={gradYear}
                onChange={(e)=>setGradYear(e.target.value)}
                />
            </label>
            </div>
            <button onClick={handleCreate}>
                Create
            </button>
            </form>
            </div>
            }
            </Popup>
        </div>
    )
}
export default EntryPopup;