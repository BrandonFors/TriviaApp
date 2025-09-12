// controllers that handle user data
const UserData = require("../models/UserData");


exports.score =  async (req, res) => {

  const { username, score, amtQuestions, category, difficulty } = req.body;

  try {
    const userDoc = await UserData.findOne({ username: username });

    let totalQuestions = userDoc?.totalQuestions || 0;
    let totalCorrect = userDoc?.totalCorrect || 0;
    let categories = userDoc?.categories || [];

    // find or create the given category
    let categoryObj = categories.find(cat => cat.name === category);
    if(!categoryObj){
      categories.push({
        name: category,
        items: [{ difficulty, numQuestions: amtQuestions, numCorrect: score}]
      });
    }else{
      //find or create difficulty
      let item = categoryObj.items.find(i => i.difficulty === difficulty);
      if (!item){
        //push the new quiz results into the category array
        categoryObj.items.push({difficulty, numQuestions: amtQuestions, numCorrect: score});
        
      }else{
        item.numQuestions += amtQuestions;
        item.numCorrect += score;
      }
      // Sort items by difficulty order
      const order = {easy: 1, medium: 2, hard: 3};
      categoryObj.items.sort((a,b)=>order[a.difficulty]-order[b.difficulty]);
    }

    totalQuestions += amtQuestions;
    totalCorrect += score;
    
    await UserData.updateOne(
      {username: username},
      {$set: {totalQuestions, totalCorrect, categories}},
      {upsert: true}
    );

    res.status(200).json({
      success: true,
      message: "Data updated successfully.",
    });
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
}

exports.stats = async (req, res) => {
  const {username} = req.query;
  try {
    const userDoc = await UserData.findOne({username}, {categories: 1});
    if(!userDoc){
      return res.status(500).json([])
    }
    res.json(userDoc.categories);
  } catch (error) {
    res.status(500).json({message: "Error fetching categories"});
  }
}

exports.stats_category = async (req, res) => {
  const { username, category } = req.query;

  try { 
    const userDoc = await UserData.findOne(
      {username, "categories.name": category}, 
      { "categories.$" : 1 }
    );
    if (!userDoc || !userDoc.categories || userDoc.categories.length === 0){
      return res.json({});
    }
   
    res.json(userDoc.categories[0]);

  } catch (error) {
    console.error("Error fetching category items:", error);
    res.status(500).json({message: "Error fetching category items"});
  }
}
