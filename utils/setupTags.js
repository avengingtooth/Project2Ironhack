const Tag = require("../models/Tag.model")

let setupTags = async(tag) => {
    if (typeof tag == 'string'){
        tag = [tag]
    }
    else if(!tag){
        tag = []
    }
    tag = Array.from(new Set(tag));
    let tags = []
    for(let i = 0; i < tag.length; i++){
        let curTag = tag[i]
        if(curTag.length > 0){
            try {
                tags.push(await Tag.findOneAndUpdate({name: curTag}, {name: curTag}, {new: true, upsert: true}));
            }
            catch (error){
                console.log(error)
            }
        }
    }
    return tags;
}

module.exports = setupTags;