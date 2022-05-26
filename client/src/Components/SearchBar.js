import React from 'react'
import styles from "./style.module.css";
import bar from "../assets/searchbar.png";
import { useState } from 'react';
import { getData } from "../api/index.js";
import ProblemList from './ProblemList';
import { useEffect } from 'react';
import Spinner from "./Spinner";
function SearchBar() {
    const [query, setquery] = useState();
    const [data, setdata] = useState(null);
    const [loader, setloader] = useState(false);
    const [pos, setpos] = useState(false);
    function handleChange(e) {
        setquery(e.target.value);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setdata(null)
        setloader(true)
        const results = await getData(query)
        setdata(results);
        setloader(false)
        setpos(true)
        setquery(null)
    }
    useEffect(() => {
        if (data) {
           // console.log(data);
        }
    }, [data])

    return (
        <div className={styles.container}>
            <form className={pos ? styles.wrapperOpen : styles.wrapper} onSubmit={function (e) { handleSubmit(e) }}>
                <input type="text" className={styles.input}
                    placeholder="Search your problem here" onChange={function (e) { handleChange(e) }} />
                <button className={styles.searchbtn} type="submit"><img className={styles.fas} src={bar} alt=""></img></button>
            </form>
            <div >
                {loader && <Spinner />}
            </div>
            <ProblemList data={data} />
        </div>
    )
}

export default SearchBar