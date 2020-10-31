import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Request, Response} from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import routes from "./routes/index";
//import {User} from "./entity/User";

createConnection().then(async () => {
	const app = express();

	app.set('port', process.env.PORT || 3000);

	app.use(cors());
	app.use(morgan('dev'));
	app.use(helmet());
	app.use(express.json());
	app.use('/', routes);

	await app.listen(app.get('port'), () => {
		console.log('SERVER IS RUNNING ON PORT:', app.get('port'));
	});
}).catch(error => console.log(error));