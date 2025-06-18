import { MongoClient, Db } from 'mongodb';
import { IOwner, ICar, IOwnership } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const MONGO_URL = 'mongodb://api_user:api_password@localhost:27017';
const DATABASE_NAME = 'api_test';

class MongoSeeder {
  private client: MongoClient;
  private db: Db;

  public async seed() {
    try {
      console.log('🚀 Starting MongoDB seeding...');

      await this.connectToMongoDB();
      await this.dropCollections();
      await this.createIndexes();
      await this.seedData();

      console.log('✅ MongoDB seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      process.exit(1);
    } finally {
      if (this.client) {
        await this.client.close();
        console.log('✅ MongoDB connection closed');
      }
    }
  }

  private async connectToMongoDB() {
    this.client = new MongoClient(MONGO_URL);
    await this.client.connect();
    this.db = this.client.db(DATABASE_NAME);
    console.log('✅ Connected to MongoDB');
  }

  private async dropCollections() {
    const collections = ['owners', 'cars', 'ownerships'];

    for (const collectionName of collections) {
      try {
        await this.db.collection(collectionName).drop();
        console.log(`✅ Dropped collection: ${collectionName}`);
      } catch (error) {
        console.log(`ℹ️  Collection ${collectionName} doesn't exist, skipping`);
      }
    }
  }

  private async createIndexes() {
    await this.db.collection('ownerships').createIndex({ createdAt: 1 });
    await this.db.collection('ownerships').createIndex({ updatedAt: 1 });

    await this.db.collection('owners').createIndex({ createdAt: 1 });
    await this.db.collection('owners').createIndex({ updatedAt: 1 });

    await this.db.collection('cars').createIndex({ createdAt: 1 });
    await this.db.collection('cars').createIndex({ updatedAt: 1 });

    // TODO: Add indexes for the other fields

    console.log('✅ Created indexes');
  }

  private async seedData() {
    const dataPath = path.join(__dirname, 'data');

    const owners: IOwner[] = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'owners.mongo.json'), 'utf8')
    );

    const cars: ICar[] = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'cars.mongo.json'), 'utf8')
    );

    const ownerships: IOwnership[] = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'ownerships.mongo.json'), 'utf8')
    );

    const ownersWithDates = owners.map((owner) => ({
      ...owner,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const carsWithDates = cars.map((car) => ({
      ...car,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const ownershipsWithDates = ownerships.map((ownership) => ({
      ...ownership,
      startDate: new Date(ownership.startDate),
      endDate: ownership.endDate ? new Date(ownership.endDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await this.db.collection('owners').insertMany(ownersWithDates);
    console.log(`✅ Inserted ${owners.length} owners`);

    await this.db.collection('cars').insertMany(carsWithDates);
    console.log(`✅ Inserted ${cars.length} cars`);

    await this.db.collection('ownerships').insertMany(ownershipsWithDates);
    console.log(`✅ Inserted ${ownerships.length} ownerships`);
  }
}

const seeder = new MongoSeeder();
seeder.seed();
