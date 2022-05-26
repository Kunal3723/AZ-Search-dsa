import { data } from "../database.js";
import { clean_query, freq_map, get_length_of_query } from "../Helper/pre_functions.js";
import SpellChecker from "simple-spellchecker";
var dictionary = SpellChecker.getDictionarySync("en-US");
export function get_query_tf(query, database) {
    query = clean_query(query)
    query = spellCor(query);
  //console.log(query)
    let query_size = get_length_of_query(query)
    let map = freq_map(database, query)
    for (const key in map) {
        map[key] = map[key] / query_size
    }
    return map;
}
function spellCor(obj) {
    const data = [];

    obj.map((el) => {
        let mis = !dictionary.spellCheck(el);
        // console.log(mis);
        if (mis) {
            let sug = dictionary.getSuggestions(el);
            data.push(sug[0].toLowerCase());
        }
        else {

            data.push(el.toLowerCase());
        }
    })
    return data;
}

export function get_query_importance(tf, idf) {
    let map = {};
    for (const key in tf) {
        map[key] = tf[key] * idf[key];
    }
    return map;
}

export function get_similarity(q_tfidf, imp) {
    let map = new Map();
    for (let i = 0; i < imp.length; i++) {
        let q = 0, sq1 = 0, sq2 = 0;
        for (const key in q_tfidf) {
            if (imp[i][key] === undefined) {
                imp[i][key] = 0;
            }
            q += q_tfidf[key] * imp[i][key]
            sq1 += q_tfidf[key] * q_tfidf[key]
            sq2 += imp[i][key] * imp[i][key]
        }
        let ans
        if (Math.sqrt(sq1) * Math.sqrt(sq2) === 0) {
            ans = 0
        }
        else {
            ans = (q) / (Math.sqrt(sq1) * Math.sqrt(sq2))
        }
        if (ans === NaN) {
            ans = 0
        }
        map.set(i, ans);
    }
    let sort_map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    let i = 0;
    const results = [];

    for (let [key, value] of sort_map) {

        if (value === 0 && i === 0) {
            let res = {
                url: "",
                problem: "Search another problem",
                name: "Sorry we dont couldn't find your query in our database"
            }
            results.push(res)
            return results
        }
        if (value === 0 || i == 10) {
            break;
        }
        i++;
        results.push(data[key])
        //console.log("<----------------->");
    }
    return results
}