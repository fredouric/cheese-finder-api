export interface Cheese {
  id: string;
  departement: string;
  fromage: string;
  lait: string[];
  geo_shape: {
    geometry: {
      coordinates: number[][][];
    };
  };
  geo_point_2d: {
    lon: number;
    lat: number;
  };
  favorite: boolean;
}
