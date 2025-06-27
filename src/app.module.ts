import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env', }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AuthModule,
    MoviesModule,
    FavoritesModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
