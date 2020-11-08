module.exports.rng_list = function(arr){
    let arr_word = arr;

    let offset = Math.random();

    for(let x = 0; x < arr_word.length; x++){
        let r = Math.random();
        let copy = arr_word[x];
  
        if(r > 0.5){
            if(arr_word[x + 1] != undefined){
            arr_word[x] = arr_word[x + 1];
            arr_word[x + 1] = copy;
            }else{
                arr_word[x] = arr_word[x - 1];
                arr_word[x - 1] = copy;
            };
        }else{
            if(arr_word[x - 1] != undefined){
                arr_word[x] = arr_word[x - 1];
                arr_word[x - 1] = copy;
            }else{
                arr_word[x] = arr_word[x + 1];
                arr_word[x + 1] = copy;
            };
        };
    };
    if(offset > 0.5){
        return arr_word.reverse();
    }else{
        return arr_word;
    };
};

const text_items = require('./text/textCard.json');
module.exports.rng_text_qs = function(){
    let qs_card = text_items.blackCards;
    let rng = Math.floor(Math.random()*qs_card.length);
    return qs_card[rng]
};

module.exports.rng_text_ideas = function(){
    let white_card = text_items.whiteCards;
    let rng = Math.floor(Math.random()*white_card.length);
    return white_card[rng]
};