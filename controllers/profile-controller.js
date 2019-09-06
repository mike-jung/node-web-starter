/**
 * This controller access database and map result columns
 * 
 * GET http://localhost:7001/profile/get
 * GET http://localhost:7001/profile/add
 * GET http://localhost:7001/profile/list
 */

'use strict';
 
import Database from '../database/database_mysql';
import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';

class ProfileController {

    constructor() {
			logger.debug(`ProfileController initialized.`);
				
			this.database = new Database('database_mysql');
    }

    /**
     * Get a profile from person table
     * 
     * @route GET /profile/get
     * @group profile - Operations about profile
     * @param {string} name.query.required profile's name
     * @returns {object} 200 - An array of profile info
     * @returns {Error}  default - Unexpected error
     */
    /**
     * Get a profile from person table
     * 
     * @route POST /profile/get
     * @group profile - Operations about profile
     * @param {string} name.body.required profile's name
     * @returns {object} 200 - An array of profile info
     * @returns {Error}  default - Unexpected error
     */
	get(req, res) {
		const params = param.parse(req);

		const queryParams = {
			sqlName: 'person_get',
			params: params
		}

		this.database.executeSql(queryParams, (err, rows) => {
			if (err) {
				console.log('executeSql error -> ' + err);
				util.sendError(res, 400, 'executeSql error -> ' + err);

				return;
			}
			
			util.sendRes(res, 200, 'OK', rows);
		});
	}
 
    /**
     * Add a profile in person table
	 * This example shows how to call database.execute method
     * 
     * @route GET /profile/add
     * @group profile - Operations about profile
     * @param {string} name profile's name
     * @param {number} age profile's age
     * @param {string} mobile profile's mobile
     * @returns {object} result
     * @returns {Error}  default - Unexpected error
     */
	async add(req, res) {
        const params = param.parse(req);
	
		try {
			const queryParams = {
				sqlName: 'person_add',
				params: params
			}

			const rows = await this.database.execute(queryParams);

			util.sendRes(res, 200, 'OK', rows);
		} catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
		}

	}

	/**
	 * Example for mapper usage
	 * The following result columns will be mapped
	 * 
	 * name -> alias
	 * mobile -> phone
	 */
	async list(req, res) {
        const params = param.parse(req);
	
		try {
			const queryParams = {
				sqlName: 'person_list',
				params: params,
				mapper: {
					alias: 'name',
					phone: 'mobile'
				}
			}
  
			const rows = await this.database.execute(queryParams);

			util.sendRes(res, 200, 'OK', rows);
		} catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
		}

	}

 
	/**
	 * List using mapper for result column mapping
	 */
	async list2(req, res) {
        const params = param.parse(req);
	
		try {
			const queryParams = {
				sqlName: 'person_list',
				params: params,
				mapper: {
					alias: 'name',
					phone: 'mobile'
				}
			}
  
			const rows = await this.database.execute(queryParams);

			util.sendRes(res, 200, 'OK', rows);
		} catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
		}

	}

	/**
	 * Upload file
	 */
	upload(req, res) {
		const params = param.parse(req);

		console.log('FILES');
		console.dir(req.files);
	
		// move uploaded files from uploads folder to public/images folder
		if (req.files.length > 0) {
			var oldFile = './uploads/' + req.files[0].filename;
			var newFile = './public/images/' + req.files[0].filename;
	
			fs.rename(oldFile, newFile, (err) => {
				if (err) {
					console.log('Error in moving file : ' + err);
					util.sendError(res, 400, 'Error in moving file : ' + err);
					return;
				}
	
				console.log('File copied to ' + newFile);
	
				// include uploaded file path
				const output = {
					filename:'/images/' + req.files[0].filename
				}
	
				util.sendRes(res, 200, 'OK', output);
			})
		}	
	}
  
}

module.exports = ProfileController;