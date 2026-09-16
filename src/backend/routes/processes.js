const express = require("express");
const SelectionProcess = require("../models/SelectionProcess");

const router = express.Router();

function buildQuery(filters) {
  const query = {};

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  ["role", "confirmedPresence", "attended", "approved", "hired", "scheduledBy", "attendedBy"].forEach((field) => {
    if (filters[field]) query[field] = filters[field];
  });

  return query;
}

router.get("/", async (req, res, next) => {
  try {
    const processes = await SelectionProcess.find(buildQuery(req.query)).sort({
      scheduledDate: 1,
      time: 1,
      createdAt: -1
    });
    res.json(processes);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const process = await SelectionProcess.create(req.body);
    res.status(201).json(process);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const process = await SelectionProcess.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!process) {
      return res.status(404).json({ message: "Processo seletivo nao encontrado" });
    }

    res.json(process);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const process = await SelectionProcess.findByIdAndDelete(req.params.id);

    if (!process) {
      return res.status(404).json({ message: "Processo seletivo nao encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
