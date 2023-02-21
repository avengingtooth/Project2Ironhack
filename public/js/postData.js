const Tag = require("../../models/Tag.model")

let postData = async(info) => {
    let {title, content, tag} = info
    if (typeof tag == 'string'){
        tag = [tag]
    }
    else if(!tag){
        tag = []
    }
    let newTags = []
    for(let i = 0; i < tag.length; i++){
        let curTag = tag[i]
        if(curTag.length > 0){
            try{
                newTags.push(await Tag.create({name: curTag}))
            }
            catch{
            }
        }
    }
    return {title, content, newTags}
}

module.exports = postData