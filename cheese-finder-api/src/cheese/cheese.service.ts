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
            .filter((cheese) => cheese.geo_point_2d)
            .map((cheese) => ({
              departement: cheese.departement,
              fromage: cheese.fromage,
              lait: cheese.lait,
              geo_point_2d: {
                lon: cheese.geo_point_2d.lon,
                lat: cheese.geo_point_2d.lat,
              },
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
        duplicate.fromage === cheese.fromage &&
        duplicate.departement == cheese.departement,
    );
    if (duplicate === undefined) {
      this.cheeses.push(cheese);
      return cheese;
    } else {
      throw new InternalServerErrorException('Cheese already exists.');
    }
  }

  getCheeseWithNameAndDepartement(
    fromage: string,
    departement: string,
  ): Cheese[] {
    return this.cheeses.filter(
      (cheese) =>
        cheese.fromage.toUpperCase() === fromage.toUpperCase() &&
        cheese.departement.toUpperCase() === departement.toUpperCase(),
    );
  }

  searchCheese(fromage: string): Cheese[] {
    return this.cheeses.filter((cheese) =>
      cheese.fromage.toUpperCase().includes(fromage.toUpperCase()),
    );
  }

  isValidCheese(cheese: Cheese): boolean {
    if (
      cheese &&
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