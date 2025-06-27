import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MoviesService {
  private readonly omdbApiKey: string;
  private readonly omdbUrl = 'http://www.omdbapi.com/';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.omdbApiKey = this.configService.get<string>('OMDB_API_KEY')!;
  }

  async searchMoviesByTitle(title: string): Promise<any> {
    try {
      const url = `${this.omdbUrl}?apikey=${this.omdbApiKey}&s=${encodeURIComponent(title)}`;
      const response = await lastValueFrom(this.httpService.get(url));
      if (response.data.Response === 'False') {
        throw new HttpException(response.data.Error, 404);
      }
      return response.data.Search;
    } catch (err) {
      throw new HttpException('Error buscando películas', 500);
    }
  }

  async searchMoviesByYear(
    year: string,
    type: 'movie' | 'series',
    limit = 15,
  ): Promise<any[]> {
    const searchTerms = ['the', 'of', 'a', 'an', 'man', 'love', 'war', 'life']; // términos genéricos

    const results: any[] = [];

    for (const term of searchTerms) {
      if (results.length >= limit) break;

      const response = await firstValueFrom(
        this.httpService.get(this.omdbUrl, {
          params: {
            apikey: this.omdbApiKey,
            s: term,
            y: year,
            type,
          },
        }),
      );

      if (response.data?.Search) {
        for (const item of response.data.Search) {
          if (results.length < limit) {
            results.push(item);
          } else {
            break;
          }
        }
      }
    }

    return results.slice(0, limit);
  }

  async getMovieById(imdbID: string): Promise<any> {
  try {
    const url = `${this.omdbUrl}?apikey=${this.omdbApiKey}&i=${imdbID}`;
    const response = await firstValueFrom(this.httpService.get(url));

    if (response.data?.Response === 'False') {
      return null;
    }

    return response.data;
  } catch (error) {
    throw new HttpException('Error obteniendo película por ID', 500);
  }
}

}
