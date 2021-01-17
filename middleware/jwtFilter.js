const jwt = require("jsonwebtoken");
const jwt_key =
	"ITSS_Team7_NguyenVanDung_NguyenThiThuUyen_PhamMinhHieu_NguyenVietLong";
const jwtFilter = (req, res, next) => {
	const jwtToken = req.cookies["Authorization"];
	jwt.verify(jwtToken, jwt_key, (error, decode) => {
		if (!error) {
			req.role = parseInt(decode.role);
			next();
		} else {
			res.status(403).json({ message: "Forbidden" });
		}
	});
};
module.exports = jwtFilter;
