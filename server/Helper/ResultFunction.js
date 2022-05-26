import { keywords } from "../Utility/keywords.js";
import { idf } from "../Utility/idf.js"
import { tfidf as imp } from "../Utility/tfidf.js"
import { get_query_importance, get_query_tf, get_similarity } from "./query_functions.js"

export function get_results(query) {

    let q_tf = get_query_tf(query, keywords);

    const q_tfidf = get_query_importance(q_tf, idf);

    return get_similarity(q_tfidf, imp);
}

//     const query = "SUM"
//    console.log(get_results(query));














