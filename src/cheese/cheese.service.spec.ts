// cheese.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CheeseService } from './cheese.service';

describe('CheeseService', () => {
  let service: CheeseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheeseService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<CheeseService>(CheeseService);
  });

  describe('addCheese', () => {
    it('should add a valid cheese', () => {
      const validCheese = {
        departement: 'A',
        fromage: 'Brie',
        lait: ['cow'],
        geo_point_2d: { lon: 1, lat: 2 },
      };

      expect(() => service.addCheese(validCheese)).not.toThrow();
      expect(service.getAllCheeses()).toContainEqual(validCheese);
    });

    it('should throw BadRequestException for invalid cheese', () => {
      const invalidCheese = {
        departement: 'A',
        fromage: '', // Invalid: empty string
        lait: ['cow'],
        geo_point_2d: { lon: 1, lat: 2 },
      };

      expect(() => service.addCheese(invalidCheese)).toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for duplicate cheese', () => {
      const duplicateCheese = {
        departement: 'A',
        fromage: 'Brie',
        lait: ['cow'],
        geo_point_2d: { lon: 1, lat: 2 },
      };

      // Adding the first cheese
      service.addCheese(duplicateCheese);

      // Adding a duplicate cheese should throw an InternalServerErrorException
      expect(() => service.addCheese(duplicateCheese)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
