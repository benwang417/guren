function generateUrl(title, id){
    const removeSpaces = `/anime/series/${id}/${title.replace(/\s/g , "-")}` //replace spaces with hyphen in urls
    const removeColon = removeSpaces.replace(/:/g,'')  // remove ':' from urls
    return removeColon
}

export default generateUrl