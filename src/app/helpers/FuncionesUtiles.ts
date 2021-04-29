export const retornarStringSiexiste = (object, attribute) => {

  if(object.hasOwnProperty(attribute)){
    return object[attribute]
  }else{
    return ''
  }

}
