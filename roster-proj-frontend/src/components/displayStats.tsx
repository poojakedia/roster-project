import React, { useState,useEffect } from "react";
import Popup from 'reactjs-popup';

function DisplayStats(){
    const [stats, setStats]= useState({"majors":{},"grad years":{}});
    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                const resp = await fetch('http://127.0.0.1:5000/get_summary');
                if (!resp.ok){
                    throw new Error(`Error: ${resp.status}`);
                }
                const result = await resp.json();
                console.log(result);
                setStats(result);
            } catch(err){
                console.log(err.message);
            }
            
        }
        fetchData();
    },[]);
    return(
        <div>
            <Popup trigger={<button> Summary ✨ </button>} modal nested>
            {
            <div style={{backgroundColor:"beige", borderColor:"black"}}>
                <div>
                    <h3>Majors: </h3>
                    {Object.keys(stats["majors"]).map((major)=>
                    (<p key={major}>
                        {major}:{stats["majors"][major]}
                    </p>))}
                </div>
                <div>
                <h3>Grad Years: </h3>
                    {Object.keys(stats["grad years"]).map((year)=>
                    (<p key={year}>
                        {year}:{stats["grad years"][year]}
                    </p>))}
                </div>
            </div>
            
            }
            </Popup>
        </div>
    )
}
export default DisplayStats;