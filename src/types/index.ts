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