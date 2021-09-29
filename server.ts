import express from "express";
const router = express.Router();

const app = express();
const PORT = 8000;

router.get('/', (req,res) => res.send('Express + TypeScript Server 2'));

app.use(router);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});