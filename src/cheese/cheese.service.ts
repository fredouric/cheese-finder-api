import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { Cheese } from './interfaces/cheese.interface';
import { ApiResponseRJS } from './dto/cheese.rjs';
import { map } from 'rxjs';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import 'uuid';

@Injectable()
export class CheeseService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {
    this.cheeses = [];
  }

  cheeses: Cheese[];

  async onModuleInit() {
    // API has 338 entries
    Promise.all([
      this.getCheesesFromAPIWithLimit(100, 0),
      this.getCheesesFromAPIWithLimit(100, 100),
      this.getCheesesFromAPIWithLimit(100, 200),
      this.getCheesesFromAPIWithLimit(100, 300),
    ]);
  }

  async getCheesesFromAPIWithLimit(limit = 100, offset = 0) {
    const cheeseObservable = this.httpService.get<ApiResponseRJS>(
      `https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/fromagescsv-fromagescsv@public/records?limit=${limit}&offset=${offset}`,
    );

    cheeseObservable
      .pipe(
        map((response) => response.data.results),
        map((cheeses) =>
          cheeses
            .filter((cheese) => cheese.geo_shape && cheese.geo_point_2d)
            .map((cheese) => ({
              id: uuidv4(),
              departement: cheese.departement,
              fromage: cheese.fromage,
              lait: cheese.lait,
              geo_shape: {
                geometry: {
                  coordinates: cheese.geo_shape.geometry.coordinates,
                },
              },
              geo_point_2d: {
                lon: cheese.geo_point_2d.lon,
                lat: cheese.geo_point_2d.lat,
              },
              favorite: false,
            })),
        ),
      )
      .subscribe((mappedCheeses) => {
        mappedCheeses.forEach((cheese) => this.addCheese(cheese));
      });
  }

  getAllCheeses(): Cheese[] {
    return this.cheeses.sort((a, b) => a.fromage.localeCompare(b.fromage));
  }

  addCheese(cheese: Cheese): Cheese {
    if (!this.isValidCheese(cheese)) {
      throw new BadRequestException('Invalid cheese data');
    }

    const duplicate = this.cheeses.find(
      (duplicate) =>
        duplicate.fromage.toUpperCase() === cheese.fromage.toUpperCase() &&
        duplicate.departement.toUpperCase() == cheese.departement.toUpperCase(),
    );
    if (duplicate === undefined) {
      this.cheeses.push(cheese);
      return cheese;
    } else {
      throw new InternalServerErrorException('Cheese already exists.');
    }
  }

  getCheeseWithUUID(uuid: string): Cheese[] {
    return this.cheeses.filter((cheese) => cheese.id === uuid);
  }

  searchCheese(fromage: string): Cheese[] {
    return this.cheeses.filter((cheese) =>
      cheese.fromage.toUpperCase().includes(fromage.toUpperCase()),
    );
  }

  toggleFavorite(uuid: string): Cheese {
    const cheeseIndex = this.cheeses.findIndex(
      (cheese) => cheese.id.toUpperCase() === uuid.toUpperCase(),
    );

    if (cheeseIndex !== -1) {
      this.cheeses[cheeseIndex].favorite = !this.cheeses[cheeseIndex].favorite;
      return this.cheeses[cheeseIndex];
    } else {
      throw new BadRequestException('Cheese does not exist', uuid);
    }
  }

  isValidCheese(cheese: Cheese): boolean {
    if (
      cheese &&
      typeof cheese.id === 'string' &&
      uuidValidate(cheese.id) &&
      typeof cheese.departement === 'string' &&
      cheese.departement.trim() !== '' &&
      typeof cheese.fromage === 'string' &&
      cheese.fromage.trim() !== '' &&
      Array.isArray(cheese.lait) &&
      cheese.lait.every(
        (type) => typeof type === 'string' && type.trim() !== '',
      ) &&
      cheese.geo_point_2d &&
      typeof cheese.geo_point_2d.lon === 'number' &&
      typeof cheese.geo_point_2d.lat === 'number'
    ) {
      return true;
    }
    return false;
  }
}
