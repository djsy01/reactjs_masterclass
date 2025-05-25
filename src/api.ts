import axios from "axios";
const API_KEY = "10923b261ba94d897ac6b81148314a3f";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates?: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// category: now_playing | latest | top_rated | upcoming
export function getMovies(category: string) {
  return fetch(`${BASE_PATH}/movie/${category}?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}

// 타입 선언
export interface ITvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
}

export interface IGetTvResult {
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export async function getTvShows(type: "latest" | "airing_today" | "popular" | "top_rated"): Promise<IGetTvResult> {
  // TMDB에서 latest는 단일 객체 반환이라 일반 목록 API로 대체: popular 등으로 사용 가능
  let endpoint = "";
  switch (type) {
    case "latest":
      endpoint = "/tv/popular";  // latest는 단일 아이템이라 popular로 대체
      break;
    case "airing_today":
      endpoint = "/tv/airing_today";
      break;
    case "popular":
      endpoint = "/tv/popular";
      break;
    case "top_rated":
      endpoint = "/tv/top_rated";
      break;
    default:
      endpoint = "/tv/popular";
  }
  const response = await axios.get(`${BASE_PATH}${endpoint}`, {
    params: {
      api_key: API_KEY,
      language: "en-US",
      page: 1,
    },
  });
  return response.data;
}

export interface ISearchResult<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export function searchMovies(keyword: string): Promise<ISearchResult<IMovie>> {
  return fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}`).then((res) =>
    res.json()
  );
}

export function searchTvs(keyword: string): Promise<ISearchResult<ITvShow>> {
  return fetch(`${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${keyword}`).then((res) =>
    res.json()
  );
}