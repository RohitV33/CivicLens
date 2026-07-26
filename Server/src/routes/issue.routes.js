import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "All CivicLens Issues"
    });
});

export default router;