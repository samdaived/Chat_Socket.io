const moment =require("moment");

const messageCreator =(from,text)=>{
    return {
        from:from,
        text:text,
        createdAt:moment.valueOf()
    }
};
const locationMessageCreator=(user,latitude,longitude)=>{
    return {
        from:user,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        lat:latitude,
        log:longitude,
        createdAt:moment.valueOf()
    }}

module.exports ={messageCreator,locationMessageCreator}