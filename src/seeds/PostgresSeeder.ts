import { Knex, knex } from 'knex';
import { IOwner, ICar, IOwnership } from '../types';
import * as fs from 'fs';
import * as path from 'path';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'api_user',
    password: 'api_password',
    database: 'api_test',
  },
};

class PostgresSeeder {
  private db: Knex = knex(config);

  public async seed() {
    try {
      console.log('🚀 Starting PostgreSQL seeding...');

      await this.createTables();
      await this.seedData();

      console.log('✅ PostgreSQL seeding completed successfully!');
    } catch (error) {
      console.error('❌ Error during seeding:', error);
      process.exit(1);
    } finally {
      await this.db.destroy();
    }
  }

  private async createTables() {
    await this.db.schema.dropTableIfExists('ownerships');
    await this.db.schema.dropTableIfExists('cars');
    await this.db.schema.dropTableIfExists('owners');

    await this.db.schema.createTable('owners', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable();
      table.timestamps(true, true);
    });

    await this.db.schema.createTable('cars', (table) => {
      table.increments('id').primary();
      table.string('manufacturer').notNullable();
      table.string('type').notNullable();
      table.timestamps(true, true);
    });

    await this.db.schema.createTable('ownerships', (table) => {
      table.increments('id').primary();
      table.timestamp('startDate').notNullable();
      table.timestamp('endDate').nullable();
      table.integer('ownerId').unsigned().references('id').inTable('owners').onDelete('CASCADE');
      table.integer('carId').unsigned().references('id').inTable('cars').onDelete('CASCADE');
      table.timestamps(true, true);
    });

    console.log('✅ Tables created successfully');
  }

  private async seedData() {
    const dataPath = path.join(__dirname, 'data');

    const owners: IOwner[] = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'owners.pg.json'), 'utf8')
    );

    const cars: ICar[] = JSON.parse(fs.readFileSync(path.join(dataPath, 'cars.pg.json'), 'utf8'));

    const ownerships: IOwnership[] = JSON.parse(
      fs.readFileSync(path.join(dataPath, 'ownerships.pg.json'), 'utf8')
    );

    await this.db('owners').insert(
      owners.map((owner) => ({
        id: owner.id,
        name: owner.name,
        email: owner.email,
      }))
    );
    console.log(`✅ Inserted ${owners.length} owners`);

    await this.db('cars').insert(
      cars.map((car) => ({
        id: car.id,
        manufacturer: car.manufacturer,
        type: car.type,
      }))
    );
    console.log(`✅ Inserted ${cars.length} cars`);

    await this.db('ownerships').insert(
      ownerships.map((ownership) => ({
        id: ownership.id,
        startDate: new Date(ownership.startDate),
        endDate: ownership.endDate ? new Date(ownership.endDate) : null,
        ownerId: ownership.ownerId,
        carId: ownership.carId,
      }))
    );
    console.log(`✅ Inserted ${ownerships.length} ownerships`);
  }
}

const seeder = new PostgresSeeder();
seeder.seed();
