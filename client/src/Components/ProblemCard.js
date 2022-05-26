import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import styles from "./style.module.css"

function ProblemCard({ name, problem, url }) {
    const [found, setfound] = useState(true)
    useEffect(() => {
        if (problem === "Search another problem") {
            setfound(false)
        }
    }, [])

    return (
        <a href={url} target="_blank" rel="noreferrer" >
            <div className={found ? `${styles.card}  ${styles.card_1}` : `${styles.card}  ${styles.card_2}`}>
                <h3 className={styles.card__link}>{name}</h3>
                <p>{problem}</p>
            </div>
        </a>
    )
}

export default ProblemCard