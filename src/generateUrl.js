    //TODO: Potentially remove all irregular chars from url such as ';' apostrophe '.' '()' ',' , maybe transform to lowercase


function generateUrl(title, id){
    const removeSpaces = `/anime/series/${id}/${title.replace(/\s/g , "-")}` //replace spaces with hyphen in urls
    const removeColon = removeSpaces.replace(/:/g,'')  // remove ':' from urls
    return removeColon
}

export default generateUrl