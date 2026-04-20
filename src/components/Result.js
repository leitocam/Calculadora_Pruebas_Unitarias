import React from 'react';

const Result = ({ results = 0, repaymentResults = 0 }) => {
    return (
        <>
        <h2>Maximum House Value: £{results}</h2>
        <h2>Expected Monthly Repayments: £{repaymentResults}</h2> 
        </>
    )
}

export default Result;
