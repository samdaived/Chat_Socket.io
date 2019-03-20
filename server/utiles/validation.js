const isString = (da)=>{
    return typeof(da)==="string"&&da.trim().length>0
}

module.exports={isString}