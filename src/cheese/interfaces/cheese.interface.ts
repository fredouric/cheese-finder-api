export interface Cheese {
  departement: string;
  fromage: string;
  lait: string[];

  geo_point_2d: {
    lon: number;
    lat: number;
  };
}
