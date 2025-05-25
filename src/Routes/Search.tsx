import { useState } from "react";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMovies, searchTvs } from "../api";
import { IMovie, ITvShow, ISearchResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { AnimatePresence, motion, useScroll } from "framer-motion";

const Wrapper = styled.div`
  padding-top: 60px;
  background: black;
  padding-bottom: 200px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: white;
  margin: 30px 20px 10px;
  font-weight: bold;
`;

const SectionTitle = styled.h3`
  font-size: 22px;
  color: #f9d342;
  margin: 30px 20px 10px;
  font-weight: bold;
`;

const Slider = styled.div`
  position: relative;
  margin-bottom: 60px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: relative;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  border-radius: 5px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-radius: 0 0 5px 5px;
  h4 {
    text-align: center;
    font-size: 18px;
    color: white;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 10;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(20, 20, 20, 0.9);
  z-index: 20;
`;

const BigCover = styled.div<{ bgPhoto: string }>`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  background-image: url(${(props) => props.bgPhoto});
`;

const BigTitle = styled.h3`
  color: white;
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -20px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: white;
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const { scrollY } = useScroll();

  const bigMovieMatch = useMatch("/movies/:movieId");
  const bigTvMatch = useMatch("/tv/:tvId");

  const { data: movieSearchData, isLoading: movieLoading } = useQuery<ISearchResult<IMovie>>({
    queryKey: ["search", "movie", keyword],
    queryFn: () => searchMovies(keyword ?? ""),
    enabled: Boolean(keyword),
  });

  const { data: tvSearchData, isLoading: tvLoading } = useQuery<ISearchResult<ITvShow>>({
    queryKey: ["search", "tv", keyword],
    queryFn: () => searchTvs(keyword ?? ""),
    enabled: Boolean(keyword),
  });

  const onBoxClicked = (item: IMovie | ITvShow, type: "movie" | "tv") => {
    if (type === "movie") {
      navigate(`/movies/${item.id}`);
    } else {
      navigate(`/tv/${item.id}`);
    }
  };

  const onOverlayClick = () => {
    navigate(-1);
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    movieSearchData?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  const clickedTv =
    bigTvMatch?.params.tvId &&
    tvSearchData?.results.find(
      (tv) => String(tv.id) === bigTvMatch.params.tvId
    );

  if (movieLoading || tvLoading) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <Wrapper>
      <Title>Search Results for: {keyword}</Title>

      {movieSearchData?.results && movieSearchData.results.length > 0 && (
        <>
          <SectionTitle>Movies</SectionTitle>
          <Slider>
            <Row>
              {movieSearchData.results.map((movie) => (
                <Box
                  key={movie.id}
                  bgPhoto={makeImagePath(movie.backdrop_path || movie.poster_path || "")}
                  layoutId={`movie_${movie.id}`}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(movie, "movie")}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>
              ))}
            </Row>
          </Slider>
        </>
      )}

      {tvSearchData?.results && tvSearchData.results.length > 0 && (
        <>
          <SectionTitle>TV Shows</SectionTitle>
          <Slider>
            <Row>
              {tvSearchData.results.map((tv) => (
                <Box
                  key={tv.id}
                  bgPhoto={makeImagePath(tv.backdrop_path || tv.poster_path || "")}
                  layoutId={`tv_${tv.id}`}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(tv, "tv")}
                >
                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
                  </Info>
                </Box>
              ))}
            </Row>
          </Slider>
        </>
      )}

      <AnimatePresence>
        {clickedMovie && (
          <>
            <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <BigMovie
              layoutId={`movie_${clickedMovie.id}`}
              style={{ top: scrollY.get() + 100 }}
            >
              <BigCover bgPhoto={makeImagePath(clickedMovie.backdrop_path || clickedMovie.poster_path, "w500")} />
              <BigTitle>{clickedMovie.title}</BigTitle>
              <BigOverview>{clickedMovie.overview}</BigOverview>
            </BigMovie>
          </>
        )}

        {clickedTv && (
          <>
            <Overlay onClick={onOverlayClick} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <BigMovie
              layoutId={`tv_${clickedTv.id}`}
              style={{ top: scrollY.get() + 100 }}
            >
              <BigCover
  bgPhoto={makeImagePath(
    clickedTv.backdrop_path ?? clickedTv.poster_path ?? "",
    "w500"
  )}
/>
              <BigTitle>{clickedTv.name}</BigTitle>
              <BigOverview>{clickedTv.overview}</BigOverview>
            </BigMovie>
          </>
        )}
      </AnimatePresence>
    </Wrapper>
  );
}