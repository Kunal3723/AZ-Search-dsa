import React from 'react'
import "./spinnerStyle.css"
function Spinner() {
    return (
        <div>
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Spinner