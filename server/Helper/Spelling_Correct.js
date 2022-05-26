import SpellChecker from "simple-spellchecker"
import { keywords } from "./keywords.js";

var dictionary = SpellChecker.getDictionarySync("en-US");
const data = [];

keywords.map((el) => {
    let sug = dictionary.getSuggestions(el);
    data.push(sug[0]);
  //  console.log(el, sug);
})
//console.log(data);