import  jwt  from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authMiddleware = async (req, res, next) =>{
	let token = req.headers.authorization || req.headers.token;
	if(!token){
		return res.status(401).json({success:false, message:'Not Authorized, login again'})
	}

	if (token.startsWith('Bearer ')) {
		token = token.slice(7);
	}

	try {
		const decoded = jwt.verify(token,process.env.JWT_SECRET);
		req.body.userId = decoded.id;
		const user = await userModel.findById(decoded.id).select('role');
		req.user = user;
		next();
	} catch (error) {
		console.log(error)
		res.status(401).json({success:false, message:'Invalid or expired token'})
	}
}

export const requireAdmin = (req, res, next) =>{
	if (!req.user || req.user.role !== 'admin'){
		return res.status(403).json({success:false, message:'Forbidden: Admins only'})
	}
	next();
}

export default authMiddleware;