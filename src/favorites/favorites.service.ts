import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite, FavoriteDocument } from '../models/favorite.model';
import { MoviesService  } from '../movies/movies.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name)
    private favoriteModel: Model<FavoriteDocument>,
    private readonly omdbService: MoviesService,
  ) {}

  async addFavorite(userId: string, imdbID: string) {
    const existing = await this.favoriteModel.findOne({ userId, imdbID });
    if (existing) return { message: 'Ya agregaste esta película a favoritos.' };

    const data = await this.omdbService.getMovieById(imdbID);
    if (!data || data.Response === 'False') {
      throw new NotFoundException('Película no encontrada.');
    }

    const newFavorite = new this.favoriteModel({
      userId,
      imdbID,
      title: data.Title,
      year: data.Year,
      poster: data.Poster,
    });

    return await newFavorite.save();
  }

  async getFavorites(userId: string) {
    return await this.favoriteModel.find({ userId });
  }

  async removeFavorite(userId: string, imdbID: string) {
      return await this.favoriteModel.findOneAndDelete({ userId, imdbID });
  }

  async rateFavorite(
    userId: string,
    imdbID: string,
    rating: number,
    comment?: string,
  ) {
    const updated = await this.favoriteModel.findOneAndUpdate(
      { userId, imdbID },
      { rating, comment },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Favorito no encontrado para calificar.');
    }

    return updated;
  }
}
