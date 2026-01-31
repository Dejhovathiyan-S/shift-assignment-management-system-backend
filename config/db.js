const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
    mongoose.connect(process.env.DB_URL).
        then(()=>{console.log("Database Connected")}).
        catch((err)=>{console.log(err)})
}