const express = require("express");
const Address = require("../models/address");
const fetchusers = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const ApiFeatures = require("../utils/apiFeatures");

const router = express.Router();

//Route 1: Fetch All Address : GET "/api/address/fetchaddress"

router.get("/fetchaddress", fetchusers, async (req, res) => {
  const apiFind = new ApiFeatures(Address.find(), req.query).search();
  const addresses = await ApiFeatures.query;
  res.status(200).json({
    success: true,
    addresses: addresses,
  });
});
//Route 2: Add Address : POST "/api/address/addaddress"

router.post(
  "/addaddress",
  fetchusers,
  [
    body("Name", "Enter a valid Name").isLength({ min: 3 }),
    body("phone_number", "Description must be atleast 5 characters").isLength({
      max: 10,
    }),
  ],
  async (req, res) => {
    // validation errors
    try {
      const { name, phone_number } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const address = new Address({
        name,
        phone_number,
        tag,
        user: req.user.id,
      });
      const saveAddress = await address.save();
      res.json(saveAddress);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }
);

//Route 3: Update Address : PUT "/api/address/updateaddress"

router.put("/updateaddress/:id", fetchusers, async (req, res) => {
  const { name, phone_number } = req.body;
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // create new address obj
    const newaddress = {};
    if (name) {
      newaddress.name = name;
    }
    if (phone_number) {
      newaddress.phone_number = phone_number;
    }
    if (tag) {
      newaddress.tag = tag;
    }
    // find the address to be updated and update it
    let address = await Address.findById(req.params.id);
    if (!address) {
      res.status(404).send("Not Found");
    }
    if (address.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    address = await Address.findByIdAndUpdate(
      req.params.id,
      { $set: newaddress },
      { new: true }
    );
    res.json({ address });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

//Route 4: Delete Address : DEL "/api/address/deleteaddress"
router.delete("/deleteaddress/:id", fetchusers, async (req, res) => {
  try {
    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // find the address to be updated and delete it
    let address = await Address.findById(req.params.id);
    if (!address) {
      res.status(404).send("Not Found");
    }
    // allow deletion only if user owns
    if (address.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    address = await Address.findByIdAndDelete(req.params.id);
    res.json({ Success: "Address Delete" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

//Route 5: Add Bulk Address : POST "/api/address/addmanyaddress"

router.post("/addmanyaddress", fetchusers, async (req, res) => {
  try {
    const address = await Address.insertMany(req.body);
    res.status(200).json({
      success: true,
      address: address,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

//Route 6: Fetch Single Address : GET "/api/address/fetchsingleaddress"

// router.get("/fetchsingleaddress/:id", fetchusers, async (req, res) => {
//   const address = await Address.findById(req.params.id);
//   if (!address) {
//     return res.status(500).json({
//       success: false,
//       message: "Address not found",
//     });
//   }

//   res.status(202).json({ address });
// });

router.get("/");

module.exports = router;
