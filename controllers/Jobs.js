const Jobs = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { badRequestError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Jobs.find({ createdBy: req.user.id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  const job = await Jobs.find({ _id: id, createdBy: req.user.id });
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.id;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).send({ job });
};

const updateJob = async (req, res) => {
  const {
    params: { id },
    user: { id: UserId },
  } = req;
  const job = await Jobs.findOneAndUpdate(
    { _id: id, createdBy: UserId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!job) {
    throw new badRequestError(`No job with Id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id },
    user: { id: UserId },
  } = req;
  const job = await Jobs.findOneAndDelete({ _id: id, createdBy: UserId });
  if (!job) {
    throw new badRequestError(`No job with Id ${id}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: [] });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
