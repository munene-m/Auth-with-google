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

const updateTime = async(req,res)=>{
  const time = await Time.findById(req.params.id)
  if(!time){
    return res.status(404).json({error:"Not found"})
  }
  const updatedTime = await Time.findByIdAndUpdate(req.params.id, req.body, {new: true})

  res.status(200).json(updatedTime)
}

const deleteTime = async(req,res)=>{
  try {
    const time = await Time.findById(req.params.id)
    if(!time){
      return res.status(404).json({error:"Not found"})
    }
    await Time.findByIdAndDelete(req.params.id)
    res.status(200).json({message: "Time post deleted"})
  } catch (error) {
    res.status(400).json("An error occured", error);
  }
}

const getTime = async (req, res) => {
    try {
      const time = await Time.find();
      res.status(200).json(time);
    } catch (error) {
      res.status(400).json("Unknown error");
    }
  };

module.exports = {postTime, getTime, updateTime, deleteTime}
