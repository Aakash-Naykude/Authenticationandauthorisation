const User = require("../models/user.model");
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
router.post(
  "/",
  body("first_name").notEmpty().withMessage("Name is requires"),
  body("last_name").notEmpty().withMessage("Name is requires"),
  body("email").custom(async (value)=>{
    const ismail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value)
    const domain = ["gmail.com", "yahoo.com"]
    const newemail = value.split("@")
    if(!domain.includes(newemail[1])){
        throw new Error("We do not accept mail from this domain")
    }
    if(!ismail){
        throw new Error("please enter valid email")
    }
    const newinp = await User.findOne({email:value}).lean().exec()
    console.log(newinp, value)
    if(newinp){
        throw new Error("Please try new email")
    }
    return true;
  }),
  body("pincode").isLength({min:6, max:6}).withMessage("please enter valid pincode"),
  body("age").custom((value)=>{
      const isnumber = /^[0-9]*$/.test(value)
      if(!isnumber || (value<1 || value>100)){
        throw new Error("age is not valid")
      }
      return true
  }),
  body("gender").isIn(["Male", "male", "Female", "female", "Others", "other"]).withMessage("Please enter valid gender"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let newerror = errors.array().map(({value, msg, param, location})=>{
            return {
                [param]:msg,
            }
        })
      return res.status(400).json({errors:newerror})
    }
    try {
      const user = await User.create(req.body);
      return res.status(201).send(user);
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const user = await User.find().lean().exec();
    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean().exec();
    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();
    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();
    return res.status(201).send(user);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});
module.exports = router;
