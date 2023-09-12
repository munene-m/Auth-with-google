const imageAd = require("../models/ImageAds.js");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
    console.log(file);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createAd = async (req, res) => {
  const image = req.file;
  if (!image) {
    res.status(400).json({ error: "Image is required" });
  }
  try {
    const result = await cloudinary.uploader.upload(image.path, {
      width: 500,
      height: 500,
      crop: "scale",
      quality: 50,
    });

    const ad = await imageAd.create({
      image: result.secure_url,
    });
    res.status(201).json({ id: ad._id, image: ad.image });
  } catch (err) {
    res.status(400).json({ error: "An error occured" });
  }
};

const updateAd = async (req, res) => {
    const image = req.file; // Assuming you receive the updated image as a file
  
    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }
  
    try {
      // First, check if the ad with the given ID exists
      const existingAd = await imageAd.findById(req.params.id);
  
      if (!existingAd) {
        return res.status(404).json({ error: "Ad not found" });
      }
  
      // Upload the updated image to Cloudinary
      const result = await cloudinary.uploader.upload(image.path, {
        width: 500,
        height: 500,
        crop: "scale",
        quality: 50,
      });
  
      // Update the ad's image URL with the new secure URL from Cloudinary
      existingAd.image = result.secure_url;
  
      // Save the updated ad data to the database
      await existingAd.save();
  
      return res.status(200).json({ id: existingAd._id, image: existingAd.image });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred when updating ad" });
    }
  };
  

const getAd = async (req, res) => {
  try {
    const ad = await imageAd.findById(req.params.id);
    if (!ad) {
      res.status(400);
      throw new Error("This ad does not exist");
    } else {
      res.status(200).json(ad);
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAds = async (req, res) => {
  try {
    const ads = await imageAd.find();
    res.status(200).json(ads);
  } catch (error) {
    logger.error("There are no ads at this time");
    res.status(400).json({ message: "There are no ads at this time" });
  }
};

const deleteAd = async (req, res) => {
  try {
    const ad = await imageAd.findById(req.params.id);
    if (!ad) {
      res.status(404);
      throw new Error("Ad not found");
    }
    await imageAd.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "ad item deleted ✅" })
  } catch (error) {
    res.status(400).json(error);
  }
};
module.exports = { createAd, getAd, getAds, deleteAd, updateAd };
