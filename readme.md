# API Test

## Overview

Your job is to create an API in a framework of choice (e.g., Express.js, Fastify, NestJS, etc.) that manages a car ownership system. You can use any database of your choice (PostgreSQL, MongoDB, etc.).

## Data Models

Below are the TypeScript interfaces and enums that define the data structure for this system:

### Interfaces

```typescript
export interface IOwner {
  id: string;
  name: string;
  email: string;
}

export interface IOwnership {
  id: string;
  startDate: Date;
  endDate?: Date | null;
  ownerId: string;
  carId: string;
}

export interface ICar {
  id: string;
  manufacturer: ECarManufacturer;
  type: ECarType;
}
```

### Enums

```typescript
export enum ECarType {
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  VAN = 'VAN',
  SPORTS_CAR = 'SPORTS_CAR',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
}

export enum ECarManufacturer {
  TOYOTA = 'TOYOTA',
  FORD = 'FORD',
  CHEVROLET = 'CHEVROLET',
  BMW = 'BMW',
  MERCEDES_BENZ = 'MERCEDES_BENZ',
}
```

## Business Rules

- **Unique Email**: Owners must have a unique email address
- **Multiple Cars per Owner**: An owner can have multiple cars
- **Multiple Owners per Car**: A car can belong to multiple owners (over time)

## Requirements

### 1. Basic CRUD Operations
Implement basic CRUD operations for:
- **Owner** management
- **Car** management

### 2. Core Functionality
- **List manufacturers and car types by owner name**
- **Transfer car ownership** from one owner to another

### 3. Advanced Queries
Implement the following complex queries:

- **Find the car with the longest single ownership duration**
- **List all owners of a specific car manufacturer**, showing:
  - How long they owned it
  - Whether they still own it
- **List cars that have had more than 3 owners** in their history
- **Count of ownerships by car type and manufacturer**

## Setup Requirements

### Database Setup

Choose one of the following database options:

#### Option 1: PostgreSQL
```bash
docker run --name api-test-postgres \
  -e POSTGRES_DB=api_test \
  -e POSTGRES_USER=api_user \
  -e POSTGRES_PASSWORD=api_password \
  -p 5432:5432 \
  -d postgres:15
```

#### Option 2: MongoDB
```bash
docker run --name api-test-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=api_user \
  -e MONGO_INITDB_ROOT_PASSWORD=api_password \
  -e MONGO_INITDB_DATABASE=api_test \
  -p 27017:27017 \
  -d mongo:7
```

## Database Seeding

This project includes pre-built seeding scripts to populate your database with sample data for testing and development.

### Running the Seeds

Before running the seeds, make sure your database is running (see Database Setup above).

#### PostgreSQL Seeding
```bash
npm run seed:postgres
```

#### MongoDB Seeding  
```bash
npm run seed:mongodb
```
