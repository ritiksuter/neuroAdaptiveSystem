import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import helmet from "helmet";
import morgan from "morgan";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(helmet());
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(morgan("dev"));
app.use(apiLimiter);





// Routes ->
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import questionsRoutes from './routes/questions.routes.js';
import interactionsRoutes from './routes/interactions.routes.js';
import emotionsRoutes from './routes/emotions.routes.js';
import adaptationsRoutes from './routes/adaptations.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/interactions", interactionsRoutes);
app.use("/api/emotions", emotionsRoutes);
app.use("/api/adaptations", adaptationsRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Adaptive Learning Platform API is running.");
});

app.use(errorHandler);


export {app};