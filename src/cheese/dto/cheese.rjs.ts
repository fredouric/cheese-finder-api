export interface ApiResponseRJS {
  total_count: number;
  results: CheeseRJS[];
}

interface CheeseRJS {
  departement: string;
  fromage: string;
  page_francaise: string;
  english_page: string | null;
  image: string | null;
  lait: string[];
  geo_shape: {
    type: string;
    geometry: {
      coordinates: number[][][];
      type: string;
    };
    properties: Record<string, unknown>;
  };
  geo_point_2d: {
    lon: number;
    lat: number;
  };
}
