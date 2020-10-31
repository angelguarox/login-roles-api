import {getRepository} from 'typeorm';
import {Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {validate} from 'class-validator';
import {User} from '../entity/User';
import config from '../config/config';

class AuthController{
	static login = async (req: Request, res: Response) => {
		const {username, password} = req.body;
		if(!(username && password)){
			return res.status(400).json({message: 'Username and password are required'});
		}
		else{
			const userRepository = getRepository(User);
			let user: User;
			try{
				user = await userRepository.findOneOrFail({where: {username}});
			}
			catch(e){
				return res.status(400).json({message: 'Username or password are incorrect'});
			}
			if(!user.checkPassword(password)){
				return res.status(400).json('Username or password are incorrect');
			}
			const token = jwt.sign({userId: user.id, username: user.username}, config.jwtSecret, {expiresIn: '2h'});
			res.json({message: 'OK', token});
		}
	};

	static changePassword = async (req: Request, res: Response) => {
		const {userId} = res.locals.jwtPayload;
		const {oldPassword, newPassword} = req.body;
		if(!(oldPassword && newPassword)){
			res.status(400).json({message: 'Old password and new password are required'});
		}
		else if(oldPassword == newPassword){
			res.status(409).json({message: 'The passwords must be diferents'});
		}
		else{
			const userRepository = getRepository(User);
			let user: User;
			try{
				user = await userRepository.findOneOrFail(userId);
				if(!user.checkPassword(oldPassword)){
					return res.status(401).json({message: 'Check your old password'});
				}
				else{
					user.password = newPassword;
					const errors = await validate(user, {validationError: {target: false, value: false}});
					if(errors.length > 0){
						return res.status(400).json(errors);
					}
					else{
						user.hashPassword();
						await userRepository.save(user);
						return res.json({message: 'Password changed'});
					}
				}
			}
			catch(e){
				return res.status(400).json({message: 'Something woes wrong'});
			}
		}
	};
}

export default AuthController;