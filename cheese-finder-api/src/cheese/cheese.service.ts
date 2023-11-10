import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
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
    await this.getCheesesFromAPI();
  }

  async getCheesesFromAPI() {
    const cheeseObservable = this.httpService.get<ApiResponseRJS>(
      'https://data.opendatasoft.com/api/explore/v2.1/catalog/datasets/fromagescsv-fromagescsv@public/records?limit=100',
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
    this.cheeses.push(cheese);
    return cheese;
  }
}
