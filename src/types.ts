export enum VehicleClass {
  I = 'Golongan I (Sedan, Jip, Pick Up, Truk Kecil, Bus)',
  II = 'Golongan II (Truk dengan 2 gandar)',
  III = 'Golongan III (Truk dengan 3 gandar)',
  IV = 'Golongan IV (Truk dengan 4 gandar)',
  V = 'Golongan V (Truk dengan 5 gandar)',
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TollCalculationResult {
  text: string;
  sources: GroundingSource[];
  sourceType: 'database' | 'ai';
}

export interface TollFormState {
  origin: string;
  destination: string;
  vehicleClass: VehicleClass;
}