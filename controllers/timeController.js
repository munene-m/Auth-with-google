const Time = require("../models/time");

const postTime = async (req, res) => {
  const { time } = req.body;
  if (!time) {
    return res.status(400).json({ error: "Time is required" });
  }
  try{
    const newTime = await Time.create({
        time,
      });
      res.status(201).json({ id: newTime._id, time: newTime.time });
  } catch(err){
    res.status(400).json("An error occured")
  }
};

const getTime = async (req, res) => {
    try {
      const time = await Time.find();
      res.status(200).json(time);
    } catch (error) {
      res.status(400).json("Unknown error");
    }
  };

module.exports = {postTime, getTime}
