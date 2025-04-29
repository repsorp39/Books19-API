require("dotenv").config();
const app       = require("./src/app");
const dbConnect = require("./src/db/");

const PORT = process.env.PORT ?? 3500;
dbConnect()
.then(()=>{
    app.listen(PORT,()=>console.log(`Server listening to PORT  ${ PORT } ...`))
 })
