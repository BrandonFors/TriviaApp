
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


//figure out where to put this crap or if I need it
const getCategories = async () => {
  const result = await axios.get("https://opentdb.com/api_category.php");
  categoryArray = result.data.trivia_categories;
};
getCategories();

function getIdByName(name) {
  const category = categoryArray.find((item) => item.name === name);
  return category ? category.id : null; // Return id if found, null otherwise
}
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
