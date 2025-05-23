import {sendMethodNotAllowed, sendOk,} from '@/utils/apiMethods.js';
import {getCollection} from "@/utils/functions";
import {ObjectId,} from 'mongodb';
const COLLECTION_NAME = 'records';

const getRecords = async () => {
	const collection = await getCollection(COLLECTION_NAME);
	return collection.find({}).toArray();
}

// const getRecord = async (id) => {
//     const collection = await getCollection(COLLECTION_NAME);
//     return collection.findOne({_id: ObjectId.createFromHexString(id)});
// }

const getRecord = async (identifier) => {
	const collection = await getCollection(COLLECTION_NAME);
	if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
	  return collection.findOne({ _id: new ObjectId(identifier) });
	}
	return collection.findOne({ date: identifier });
  };
  

const postRecord = async (record) => {
	const collection = await getCollection(COLLECTION_NAME);
	return collection.insertOne(record);
}

const putRecord = async (record) => {
	const collection = await getCollection(COLLECTION_NAME);
	const id = record._id;
	delete record._id;
	return collection.updateOne({_id: new ObjectId(id)}, {$set: record});
}

const deleteRecord = async (id) => {
	const collection = await getCollection(COLLECTION_NAME);
	return collection.deleteOne({_id: new ObjectId(id)});
}

export default async function handler(req, res) {

	const isAllowedMethod = req.method === 'GET' || req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE';
	if(!isAllowedMethod) {
		return sendMethodNotAllowed(res);
	}

	if(req.method === 'GET' && req.query.id) {
		const id = req.query.id;
		const record = await getRecord(id);
		return sendOk(res, record);
	}
	else if(req.method === 'GET') {
		const records = await getRecords();
		return sendOk(res, records);
	}
	// else if(req.method === 'POST') {
	// 	const record = req.body;
	// 	const result = await postRecord(record);
	// 	return sendOk(res, result);
	// }
	else if(req.method === 'POST') {
		const { date, eur_ron } = req.body;
		if (!date || !eur_ron) return sendBadRequest(res, "Missing date or eur_ron");
		const result = await postRecord({ date, eur_ron });
		return sendOk(res, result);
	  }
	  
	else if(req.method === 'PUT') {
		const record = req.body;
		const result = await putRecord(record);
		return sendOk(res, result);
	}
	else if(req.method === 'DELETE') {
		const id = req.query.id;
		const result = await deleteRecord(id);
		return sendOk(res, result);
	}
}