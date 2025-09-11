// controllers that handle user data
const TriviaData = require("../models/TriviaData");


exports.score =  async (req, res) => {
  if (loggedIn) {
    const { score, amtQuestions, category, difficulty } = req.body;

    try {
      const userDoc = await TriviaData.findOne(
        { username: currentUser },
        { projection: { categories: 1, totalCorrect: 1, totalQuestions: 1 } }
      );

      let categoryExists = false;
      let difficultyExists = false;
      let existingTotalQuestions = 0;
      let existingTotalCorrect = 0;
      let existingNumQuestions = 0;
      let existingNumCorrect = 0;

      if (userDoc) {
        existingTotalQuestions = userDoc.totalQuestions;
        existingTotalCorrect = userDoc.totalCorrect;

        const categoryObj = userDoc.categories?.find(
          (categoryObj) => categoryObj.name === category
        );
        if (categoryObj) {
          categoryExists = true;

          const matchedItem = categoryObj.items.find(
            (item) => item.difficulty === difficulty
          );
          if (matchedItem) {
            difficultyExists = true;
            existingNumQuestions = matchedItem.numQuestions || 0;
            existingNumCorrect = matchedItem.numCorrect || 0;
          }
        }
      }

      const updatedTotalQuestions = existingTotalQuestions + amtQuestions;
      const updatedTotalCorrect = existingTotalCorrect + score;

      const difficultyOrder = { easy: 1, medium: 2, hard: 3 };

      if (!categoryExists) {
        const updateDoc = {
          $push: {
            categories: {
              name: category,
              items: [
                {
                  difficulty,
                  numQuestions: amtQuestions,
                  numCorrect: score,
                },
              ],
            },
          },
          $set: {
            totalCorrect: updatedTotalCorrect,
            totalQuestions: updatedTotalQuestions,
          },
        };

        await TriviaData.updateOne({ username: currentUser }, updateDoc, {
          upsert: true,
        });
      } else if (!difficultyExists) {
        const updateDoc = {
          $push: {
            "categories.$.items": {
              difficulty,
              numQuestions: amtQuestions,
              numCorrect: score,
            },
          },
          $set: {
            totalCorrect: updatedTotalCorrect,
            totalQuestions: updatedTotalQuestions,
          },
        };

        await TriviaData.updateOne(
          { username: currentUser, "categories.name": category },
          updateDoc
        );
      } else {
        const updatedNumQuestions = existingNumQuestions + amtQuestions;
        const updatedNumCorrect = existingNumCorrect + score;

        const filter = {
          username: currentUser,
          "categories.name": category,
        };

        const updateDoc = {
          $set: {
            totalCorrect: updatedTotalCorrect,
            totalQuestions: updatedTotalQuestions,
            "categories.$.items.$[item].numQuestions": updatedNumQuestions,
            "categories.$.items.$[item].numCorrect": updatedNumCorrect,
          },
        };

        const options = {
          arrayFilters: [{ "item.difficulty": difficulty }],
        };

        await TriviaData.updateOne(filter, updateDoc, options);
      }

      await TriviaData.updateOne(
        { username: currentUser, "categories.name": category },
        {
          $set: {
            "categories.$.items": userDoc.categories
              .find((cat) => cat.name === category)
              .items.sort(
                (a, b) =>
                  difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
              ),
          },
        }
      );

      res.json({
        success: true,
        message: "Data updated successfully.",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
      //update all to be this format
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    return res.send("No Login");
  }
}

exports.stats = async (req, res) => {
  try {
    const filter = {
      username: currentUser,
    };
    const projection = {
      "categories.name": 1,
    };
    const userDoc = await triviaData.findOne(filter, { projection });
    console.log(userDoc.categories);
    res.json(userDoc.categories);
  } catch (error) {
    console.error("Error fetching category items:", error);
  }
}

exports.stats_category = async (req, res) => {
  const { category } = req.body;

  try {
    const filter = {
      username: currentUser,
      "categories.name": category,
    };

    const projection = {
      "categories.$": 1,
    };
    const userDoc = await triviaData.findOne(filter, { projection });
    console.log(userDoc);
    res.json(userDoc);
  } catch (error) {
    console.error("Error fetching category items:", error);
  }
}
