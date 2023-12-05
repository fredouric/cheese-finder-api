// cheese.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CheeseService } from './cheese.service';
import { v4 as uuidv4 } from 'uuid';

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
        id: uuidv4(),
        departement: 'A',
        fromage: 'Brie',
        lait: ['cow'],
        geo_shape: {
          type: 'a',
          geometry: {
            coordinates: [
              [
                [1, 2],
                [3, 4],
                [5, 6],
                [1, 2],
              ],
            ],
            type: 'b',
          },
          properties: { key: 'value' },
        },
        geo_point_2d: { lon: 1, lat: 2 },
        favorite: false,
      };

      expect(() => service.addCheese(validCheese)).not.toThrow();
      expect(service.getAllCheeses()).toContainEqual(validCheese);
    });

    it('should throw BadRequestException for invalid cheese', () => {
      const invalidCheese = {
        id: uuidv4(),
        departement: 'A',
        fromage: '',
        lait: ['cow'],
        geo_shape: {
          type: 'a',
          geometry: {
            coordinates: [
              [
                [1, 2],
                [3, 4],
                [5, 6],
                [1, 2],
              ],
            ],
            type: 'b',
          },
          properties: { key: 'value' },
        },
        geo_point_2d: { lon: 1, lat: 2 },
        favorite: false,
      };

      expect(() => service.addCheese(invalidCheese)).toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for duplicate cheese', () => {
      const duplicateCheese = {
        id: uuidv4(),
        departement: 'A',
        fromage: 'Brie',
        lait: ['cow'],
        geo_shape: {
          type: 'a',
          geometry: {
            coordinates: [
              [
                [1, 2],
                [3, 4],
                [5, 6],
                [1, 2],
              ],
            ],
            type: 'b',
          },
          properties: { key: 'value' },
        },
        geo_point_2d: { lon: 1, lat: 2 },
        favorite: false,
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
