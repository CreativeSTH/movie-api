import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Req,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AddFavoriteSchema } from './dto/add-favorite.schema';
import { RateFavoriteSchema } from './dto/rate-favorite.schema';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addFavorite(
    @Request() req,
    @Body(new ZodValidationPipe(AddFavoriteSchema)) body,
  ) {
    return this.favoritesService.addFavorite(req.user.userId, body.imdbID);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':imdbID')
  async removeFavorite(@Req() req: any, @Param('imdbID') imdbID: string) {
    const userId = req.user.userId;
    const deleted = await this.favoritesService.removeFavorite(userId, imdbID);
    if (!deleted) {
      throw new NotFoundException('No se encontró el favorito a eliminar.');
    }
    return { message: 'Favorito eliminado correctamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('rate')
  async rateFavorite(
    @Request() req: any,
    @Body(new ZodValidationPipe(RateFavoriteSchema)) body,
  ) {
    const { imdbID, rating, comment } = body;
    return this.favoritesService.rateFavorite(
      req.user.userId,
      imdbID,
      rating,
      comment,
    );
  }
}