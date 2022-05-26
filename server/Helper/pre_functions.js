import stopword from "remove-stopwords"
import fs from "fs";
import stem from "stem-porter";
import { data } from "../database.js";
import SpellChecker from "simple-spellchecker"

var dictionary = SpellChecker.getDictionarySync("en-US");
export function removeDuplicates(arr) {
    return [...new Set(arr)];
}


export function clean_database(database) {
    database = database.toLowerCase();
    database = database.replace(',', "")
    database = database.replace('.', ' ')
    database = database.replace(/\w+\./gm, ' ')
    database = database.replace(/\w+\,/gm, ' ')
    database = database.replace(/[^a-zA-Z ]/g, " ");
    database = database.replace(/\s+/g, " ")
    database = database.split(" ");
    database = stopword.removeStopwords(database)
    database = removeDuplicates(database)
    if (database[0] == "") {
        database.shift();
    }
    let new_database = [];
    database.forEach((el) => {
        let updated = stem(el)
        new_database.push(updated);
    })
    return new_database;
}

export function create_database() {
    let database = "";
    data.map(function ({ problem }) {
        problem = problem.replace('.', "")
        problem = problem.replace(',', "")
        database = database + " " + problem
    })

    database = clean_database(database)
    return database;
}

function spellCor(obj) {
    const dataa = [];

    obj.map((el) => {
        let mis = !dictionary.spellCheck(el);
        // console.log(mis);
        if (mis) {
            let sug = dictionary.getSuggestions(el);
            let ff = sug[0];
            dataa.push(String(ff).toLowerCase());
        }
        else {

            dataa.push(el.toLowerCase());
        }
    })
    return dataa;
}

let database = create_database();
//database = spellCor(database);

export function clean_query(query) {
    query = query.replace(/[^a-zA-Z ]/g, " ");
    query = query.replace(/\s+/g, " ")
    query = query.toLowerCase();
    query = query.split(" ")
    query = stopword.removeStopwords(query)
    for (let i = 0; i < query.length; i++) {
        if (query[i] === '') {
            query.splice(i, i)
        }
    }
    let updated_query = [];
    query.forEach((el) => {
        let updated = stem(el);
        updated_query.push(updated);
    })
    return updated_query;
}

export function get_no_of_docs(data) {
    return data.length;
}

export function get_length_of_query(query) {
    return query.length;
}

export function freq_map(base, query) {
    let map = {}

    for (let i = 0; i < query.length; i++) {
        for (let j = 0; j < base.length; j++) {

            if (base[j] === query[i] && base[j] !== '') {
                if (map[query[i]]) {
                    map[query[i]]++;
                }
                else {
                    map[query[i]] = 1;
                }
            }
        }
    }

    return map;
}

export function get_tf_matrix() {
    let all_map = []
    data.map(function ({ problem }) {
        let query = problem
        query = clean_query(query)
       // query = spellCor(query)
        let query_size = get_length_of_query(query)
        let map = freq_map(database, query)
        for (const key in map) {
            map[key] = map[key] / query_size
        }
        all_map.push(map)
    })
    return all_map;
}
let tf = get_tf_matrix()
export function get_idf() {
    let idf = []
    let map = {}
    for (let i = 0; i < database.length; i++) {
        idf[i] = 0;
        for (let j = 0; j < get_no_of_docs(data); j++) {
            if (tf[j][database[i]]) {
                idf[i]++;
            }
        }

        if (idf[i] != 0) {
            idf[i] = Math.log10((get_no_of_docs(data)) / (idf[i])) + 1

            map[database[i]] = idf[i]
        }
    }
    return map
}
let idf = get_idf()
export function get_importance() {
    let all_map = [];
    for (let i = 0; i < tf.length; i++) {
        let map = {};
        for (const key in tf[i]) {
            map[key] = tf[i][key] * idf[key];
        }
        all_map.push(map);
    }

    return all_map;
}

function generate_files() {
    fs.writeFileSync("Utility/tfidf.js", "export const tfidf=" + JSON.stringify(get_importance()))
    fs.writeFileSync("Utility/idf.js", "export const idf=" + JSON.stringify(get_idf()))
    fs.writeFileSync("Utility/keywords.js", "export const keywords=" + JSON.stringify(database))
    fs.writeFileSync("Utility/tf.js", "export const tf=" + JSON.stringify(tf))
}

//generate_files()
