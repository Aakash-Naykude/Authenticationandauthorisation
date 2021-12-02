const connect = require("./configs/db")

const app = require("./index")
app.listen(4567, async function(){
    await connect()
    console.log("listening on 4567")
})