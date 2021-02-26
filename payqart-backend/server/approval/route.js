import express from "express";
import { approveCredit, updateDownPayment } from "./controller";

const approvalRouter = express.Router();

approvalRouter.post("/approveCredit", approveCredit);
approvalRouter.post("/updateDownPayment", updateDownPayment);

export default approvalRouter;
