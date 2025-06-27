import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(@Query('title') title: string) {
    return this.moviesService.searchMoviesByTitle(title);
  }

 @Get('year-movies')
  @UseGuards(JwtAuthGuard)
  async getMoviesFrom2025() {
    return this.moviesService.searchMoviesByYear('2025', 'movie');
  }

  @Get('year-series')
  @UseGuards(JwtAuthGuard)
  async getSeriesFrom2025() {
    return this.moviesService.searchMoviesByYear('2025', 'series');
  }
}
