import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  margin-bottom: 60px;
`;

const SectionTitle = styled.h3`
  color: white;
  font-size: 28px;
  margin-left: 60px;
  margin-bottom: 10px;
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
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: white;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.3,
      duration: 0.2,
      type: "tween",
    },
  },
};

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

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useViewportScroll();

  const { data: nowPlayingData, isLoading: nowPlayingLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "nowPlaying"],
    queryFn: () => getMovies("now_playing"),
  });
  const { data: latestData, isLoading: latestLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "latest"],
    queryFn: () => getMovies("latest"),
  });
  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "topRated"],
    queryFn: () => getMovies("top_rated"),
  });
  const { data: upcomingData, isLoading: upcomingLoading } = useQuery<IGetMoviesResult>({
    queryKey: ["movies", "upcoming"],
    queryFn: () => getMovies("upcoming"),
  });

  const [nowIndex, setNowIndex] = useState(0);
  const [latestIndex, setLatestIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = (
    dataLength: number,
    index: number,
    setIndex: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (leaving) return;
    toggleLeaving();
    const totalMovies = dataLength - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex(index === maxIndex ? 0 : index + 1);
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClick = () => navigate(`/`);

  const movieId = bigMovieMatch?.params.movieId;
  const allMovies = [
    ...(nowPlayingData?.results ?? []),
    ...(latestData?.results ?? []),
    ...(topRatedData?.results ?? []),
    ...(upcomingData?.results ?? []),
  ];
  const clickedMovie = movieId ? allMovies.find((movie) => movie.id === +movieId) : null;

  const isLoading = nowPlayingLoading || latestLoading || topRatedLoading || upcomingLoading;

  const nowResults = nowPlayingData?.results ?? [];
  const latestResults = latestData?.results ?? [];
  const topRatedResults = topRatedData?.results ?? [];
  const upcomingResults = upcomingData?.results ?? [];

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* Banner */}
          <Banner
            onClick={() => increaseIndex(nowResults.length, nowIndex, setNowIndex)}
            bgPhoto={makeImagePath(nowResults[0]?.backdrop_path || "")}
          >
            <Title>{nowResults[0]?.title}</Title>
            <Overview>{nowResults[0]?.overview}</Overview>
          </Banner>

          {/* Now Playing Slider */}
          <SectionTitle>Now Playing</SectionTitle>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving} mode="popLayout">
              <Row
                key={"nowPlaying" + nowIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {nowResults.length > 1
                  ? nowResults
                      .slice(1)
                      .slice(offset * nowIndex, offset * nowIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))
                  : null}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Latest Slider */}
          <SectionTitle>Latest</SectionTitle>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving} mode="popLayout">
              <Row
                key={"latest" + latestIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {latestResults.length > 0
                  ? latestResults
                      .slice(offset * latestIndex, offset * latestIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))
                  : null}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Top Rated Slider */}
          <SectionTitle>Top Rated</SectionTitle>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving} mode="popLayout">
              <Row
                key={"topRated" + topRatedIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {topRatedResults.length > 0
                  ? topRatedResults
                      .slice(offset * topRatedIndex, offset * topRatedIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))
                  : null}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Upcoming Slider */}
          <SectionTitle>Upcoming</SectionTitle>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving} mode="popLayout">
              <Row
                key={"upcoming" + upcomingIndex}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {upcomingResults.length > 0
                  ? upcomingResults
                      .slice(offset * upcomingIndex, offset * upcomingIndex + offset)
                      .map((movie) => (
                        <Box
                          layoutId={movie.id + ""}
                          key={movie.id}
                          whileHover="hover"
                          initial="normal"
                          variants={boxVariants}
                          transition={{ type: "tween" }}
                          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                          onClick={() => onBoxClicked(movie.id)}
                        >
                          <Info variants={infoVariants}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Box>
                      ))
                  : null}
              </Row>
            </AnimatePresence>
          </Slider>

          {/* Overlay and BigMovie */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie
                  layoutId={movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        bgPhoto={makeImagePath(clickedMovie.backdrop_path, "w500")}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
