import React from 'react'
import ProblemCard from './ProblemCard'

function ProblemList({ data }) {
    return (
        <div>
            {data &&
                data.map((el) => {
                    return <ProblemCard name={el.name} problem={el.problem} url={el.url} />
                })
            }
        </div>
    )
}

export default ProblemList