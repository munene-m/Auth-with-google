const game = require("../models/gameScore.js");

const postGameScore = async (req, res) => {
  const { gameScore, gameName } = req.body;
  if (!gameName) {
    return res.status(400).json({ error: "gameName is required" });
  }
  try {
    const newGameScore = await game.create({
      gameName,
      gameScore,
    });
    res.status(201).json(newGameScore);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateGameScore = async (req, res) => {
  const score = await game.findById(req.params.id);
  if (!score) {
    return res.status(404).json({ error: "Not found" });
  }
  try {
    const updatedScore = await game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedScore);
  } catch (error) {
    res.status(400).json(error);
  }
};

const getGameScore = async (req, res) => {
  try {
    const scores = await game.find();
    res.status(200).json(scores);
  } catch (error) {
    res.status(400).json("Unknown error");
  }
};

const deleteGameScore = async(req,res)=>{
    try {
      const score = await game.findById(req.params.id)
      if(!score){
        return res.status(404).json({error:"Not found"})
      }
      await game.findByIdAndDelete(req.params.id)
      res.status(200).json({message: "game score deleted"})
    } catch (error) {
      res.status(400).json("An error occured", error);
    }
  }

  module.exports = { postGameScore, updateGameScore, getGameScore, deleteGameScore }