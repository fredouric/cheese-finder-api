export interface Cheese {
  id: string;
  departement: string;
  fromage: string;
  lait: string[];
  geo_shape: {
    type: string;
    geometry: {
      coordinates: number[][][];
      type: string;
    };
    properties: Record<string, any>;
  };
  geo_point_2d: {
    lon: number;
    lat: number;
  };
  favorite: boolean;
}
