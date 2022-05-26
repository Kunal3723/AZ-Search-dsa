import { get_results } from "../Helper/ResultFunction.js";

export async function get_search_result(req, res) {
    try {
        let query = req.query;
        query = query.query;
        query = query.replace("-", " ");
        res.send(get_results(query))
    }
    catch (error) {
        const results = [{
            url: "",
            problem: "Search another problem",
            name: "Sorry we dont couldn't find your query in our database"
        }]
        res.send(results)
    }
}