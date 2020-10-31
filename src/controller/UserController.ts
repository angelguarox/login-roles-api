import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {validate} from 'class-validator';
import {User} from "../entity/User";

class UserController{
	static getAll = async (req: Request, res: Response) => {
		const userRepository = getRepository(User);
		let users;
		try{
			users = await userRepository.find();
			if(users.length > 0){
				res.send(users);
			}
			else{
				res.status(400).json({message: 'Result is bad'});
			}
		}
		catch(e){
			return res.status(404).json({message: 'No result'});
		}
	};

	static getById = async (req: Request, res: Response) => {
		const {id} = req.params;
		const userRepository = getRepository(User);
		try{
			const user = await userRepository.findOneOrFail(id);
			res.send(user);
		}
		catch(e){
			return res.status(404).json({message: 'No result'});
		}
	};

	static newUser = async (req: Request, res: Response) => {
		const {username, password, role} = req.body;
		const user = new User();
		user.username = username;
		user.password = password;
		user.role = role;
		const errors = await validate(user, {validationError: {target: false, value: false}});
		if(errors.length > 0){
			res.status(400).json(errors);
		}
		else{
			const userRepository = getRepository(User);
			try{
				user.hashPassword();
				await userRepository.save(user);
			}
			catch(e){
				return res.status(409).json({message: 'Username already exists'});
			}
			res.status(201).json({message: 'user created successfully'});
		}
	};

	static editUser = async (req: Request, res: Response) => {
		let user;
		const {id} = req.params;
		const {username, role} = req.body;
		const userRepository = getRepository(User);
		try{
			user = await userRepository.findOneOrFail(id);
			user.username = username;
			user.role = role;
		}
		catch(e){
			return res.status(404).json({message: 'User not found'});
		}
		const errors = await validate(user, {validationError: {target: false, value: false}});
		if(errors.length > 0){
			res.status(400).json(errors);
		}
		else{
			try{
				await userRepository.save(user);
			}
			catch(e){
				return res.status(409).json({message: 'Username already in use'});
			}
			res.status(201).json({message: 'User updated successfully'});
		}
	};

	static deleteUser = async (req: Request, res: Response) => {
		const {id} = req.params;
		const userRepository = getRepository(User);
		let user: User;
		try{
			user = await userRepository.findOneOrFail(id);
		}
		catch(e){
			return res.status(404).json({message: 'User not found'});
		}
		await userRepository.delete(id);
		res.status(201).json({message: 'User deleted successfully'});
	};
}

export default UserController;