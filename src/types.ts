/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Movie {
  id: string;
  title: string;
  titleBn: string;
  originalTitle?: string;
  language: 'bangla' | 'english' | 'indian';
  year: number;
  rating: number; // e.g. 8.7
  duration: string; // e.g. "2h 15m"
  genres: string[];
  genresBn: string[];
  director: string;
  directorBn: string;
  cast: string[];
  bannerUrl: string; // 16:9 ratio
  posterUrl: string; // 3:4 or 1:1 ratio
  description: string;
  descriptionBn: string;
  features: string[]; // e.g. ["4K Ultra HD", "Dolby Atmos", "Dual Audio"]
  videoUrl?: string; // Mock stream
}

export interface Review {
  id: string;
  movieId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type LanguageMode = 'en' | 'bn';
