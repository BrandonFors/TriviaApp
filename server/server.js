
////////////////////// FIXING IN PROGRESS \\\\\\\\\\\\\\\\\\\\\
const dotenv = require('dotenv'); 

dotenv.config();
const PORT = process.env.PORT;
const app = require('./src/app')
const connectDB = require("./src/utils/connectDB");

connectDB();



app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});



