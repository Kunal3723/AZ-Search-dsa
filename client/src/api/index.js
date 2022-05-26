import axios from 'axios';

const url = 'https://dsa-search.herokuapp.com/search';

export async function getData(query) {
   // console.log(query);
    const updated_query = query.replace(" ", "-");
    const updated_url = url + "?" + "query=" + updated_query
    const data = await axios.get(updated_url);
    return data.data;
}

