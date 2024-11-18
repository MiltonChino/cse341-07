const Doc = require("../models/Docs");

const getAll = async (req, res) => {
  try {
    const result = await Doc.find();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
    return await res;
  } catch (error) {
    res.status(404);
    return res.send("No document found");
  }
};

const getOne = async (req, res) => {
  try {
    const result = await Doc.findById(req.params.id);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
    return await res;
  } catch (error) {
    res.status(404);
    return res.send("Document not found");
  }
};

const insertDoc = async (req, res) => {
  const data = req.body.doc;
  try {
    const newDoc = new Doc({
      doc: {
        title: data.title,
        description: data.description,
        sentBy: data.sentBy,
        updatedBy: data.updatedBy,
        source: data.source,
        approval: data.approval,
      },
    });
    console.log(newDoc);

    await newDoc.save();
    if (newDoc._id) {
      res.status(201).json(`User ${newDoc._id} created`);
    } else {
      res
        .status(500)
        .json(newDoc.error || "An error occurred while creating the contact.");
    }
  } catch (error) {
    res.status(500);
    res.send(error || "Internal Server Error");
  }
};

const updateDoc = async (req, res) => {
  const data = req.body.doc;
  try {
    const newInfo = {
      doc: {
        title: data.title,
        description: data.description,
        sentBy: data.sentBy,
        updatedBy: data.updatedBy,
        source: data.source,
        approval: data.approval,
      },
    };
    console.log(newInfo);
    const result = await Doc.findById(req.params.id);
    result.doc.title = newInfo.doc.title;
    result.doc.description = newInfo.doc.description;
    result.doc.sentBy = newInfo.doc.sentBy;
    result.doc.source = newInfo.doc.source;
    result.doc.approval = newInfo.doc.approval;
    await result.save();
    res.status(201).json(`User ${result._id} updated`);
  } catch (error) {
    res.status(500);
    res.send(error.message || "Internal Server Error");
  }
};

const deleteDoc = async (req, res) => {
  try {
    const result = await Doc.deleteOne({ _id: req.params.id });
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(204).json(result);
    } else {
      res
        .status(500)
        .json(
          response.error || "An error occurred while deleting the contact."
        );
    }
  } catch (error) {
    // console.log(error);
    res.status(404);
    return res.send("Doc not found");
  }
};

module.exports = {
  getAll,
  getOne,
  insertDoc,
  updateDoc,
  deleteDoc,
};
