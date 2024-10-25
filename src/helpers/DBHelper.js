import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

import log from "./Logger.js";

import serverConfigurations from "../../serverConfigurations.js";
const { db } = serverConfigurations;
const uri = `mongodb+srv://${db.username}:${db.password}@${db.url}`;

/**
 *
 * @returns client connection.
 */
const connect = () =>
  new Promise(async (resolve, reject) => {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    let step = 1;
    try {
      await client.connect();
      step++;
      resolve(client);
    } catch (e) {
      log.error(`database connection error ${e.message} step ${step}`);
      reject(e.message);
    }
  });

/**
 *
 * @returns resolve/null upon success and with reject/message
 *          when connection fails.
 */
const ping = (corr_id) =>
  new Promise(async (resolve, reject) => {
    let client = null;
    let step = 1;
    try {
      client = await connect();
      step++;
      await client.db(db.database).command({ ping: 1 });
      step++;
      await client.close();
      log.debug(`successfully connected to the DB. corr_id=${corr_id}`);
      resolve(null);
    } catch (e) {
      log.error(
        `DB OPERATION ERROR. step ${step}. ${e.message}, corr_id=${corr_id}`
      );
      if (client) {
        await client.close();
      }
      reject(e.message);
    }
  });

/**
 *
 * @param {*} dbName
 * @param {*} collectionName
 * @param {*} query
 * @returns array of objects.
 */
const queryDB = (dbName, collectionName, query, corr_id = "") =>
  new Promise(async (resolve, reject) => {
    let client = null;
    let step = 1;
    try {
      client = await connect();
      step++;
      const db = client.db(dbName);
      step++;
      const collection = db.collection(collectionName);
      step++;
      const cur = await collection.find(query);
      step++;
      const res = await cur.toArray();
      await client.close();
      resolve(res);
    } catch (e) {
      log.error(`Error - ${e.message} at step=${step}. corr_id=${corr_id}`);
      if (step > 1) {
        await client.close();
      }
      reject(e.message);
    }
  });

/**
 *
 * @param {*} dbName
 * @param {*} collectionName
 * @param {*} query
 * @returns array of objects.
 */
const queryByID = (dbName, collectionName, _id, corr_id = "") =>
  new Promise(async (resolve, reject) => {
    let client = null;
    let step = 1;
    try {
      client = await connect();
      step++;
      const db = client.db(dbName);
      step++;
      const collection = db.collection(collectionName);
      step++;
      const document = await collection.findOne({ _id: new ObjectId(_id) });
      step++;
      await client.close();
      resolve(document);
    } catch (e) {
      log.error(`Error - ${e.message} at step=${step}. corr_id=${corr_id}`);
      if (step > 1) {
        await client.close();
      }
      reject(e.message);
    }
  });

/**
 *
 * @param {*} dbName
 * @param {*} collectionName
 * @param {*} query
 * @returns
 */
const createDB = (dbName, collectionName, data, corr_id = "") =>
  new Promise(async (resolve, reject) => {
    let client = null;
    let step = 1;
    try {
      client = await connect();
      step++;
      const db = client.db(dbName);
      step++;
      const collection = db.collection(collectionName);
      step++;
      await collection.insertOne(data);
      step++;
      await client.close();
      resolve("OK");
    } catch (e) {
      log.error(`Error - ${e.message} at step ${step}. corr_id=${corr_id}`);
      if (step > 1) {
        await client.close();
      }
      reject(e.message);
    }
  });

export { connect, ping, queryDB, createDB, queryByID };
