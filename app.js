const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.get("/", (req, res) => {
	console.log("connected server ...");
	res.sendStatus(200);
});

io.on("connect", (socket) => {
	console.log("connected ...");
	socket.on("join", (foodId) => {
		socket.leave(socket.rooms);
		socket.join(`food:${foodId}`);
	});

	socket.on("typing", (data) => {
		const { foodId } = data;
		socket.broadcast.to(`food:${foodId}`).emit("typing", data);
	});

	socket.on("endTyping", (data) => {
		const { foodId } = data;
		socket.broadcast.to(`food:${foodId}`).emit("endTyping", data);
	});

	socket.on("comment", (data) => {
		const { foodId } = data;
		socket.broadcast.to(`food:${foodId}`).emit("comment", data);
	});
	socket.on("typingVote", (foodId) => {
		socket.broadcast.to(`food:${foodId}`).emit("typingVote");
	});
	socket.on("addNewVote", (data) => {
		const { foodId } = data;
		socket.broadcast.to(`food:${foodId}`).emit("addNewVote", data);
	});
	socket.on("disconnect", () => {
		console.log("disconnect .....");
	});
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send("file is incorrect");
});

server.listen(process.env.PORT || 5000, () => {
	console.log("Server is running ...");
});
