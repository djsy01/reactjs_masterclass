import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { getTvShows, IGetTvResult, ITvShow } from "../api";
import { makeImagePath } from "../utils";

// ✅ 스타일 컴포넌트는 Home.tsx의 것과 동일하게 유지
// (Wrapper, Loader, Banner, Slider, Row, Box, Info, Overlay, BigMovie, BigCover, BigTitle, BigOverview, SectionTitle 등)

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

// 🔹 공통 슬라이더 컴포넌트
interface TvSliderProps {
  title: string;
  data: ITvShow[];
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onBoxClicked: (tvId: number) => void;
  leaving: boolean;
  toggleLeaving: () => void;
}

function TvSlider({
  title,
  data,
  index,
  setIndex,
  onBoxClicked,
  leaving,
  toggleLeaving,
}: TvSliderProps) {
  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    const total = data.length;
    const maxIndex = Math.floor(total / offset) - 1;
    setIndex(index === maxIndex ? 0 : index + 1);
  };

  return (
    <>
      <SectionTitle>{title}</SectionTitle>
      <Slider onClick={increaseIndex}>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving} mode="popLayout">
          <Row
            key={title + index}
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
          >
            {data
              .slice(offset * index, offset * index + offset)
              .map((tv) => (
                <Box
                  layoutId={"tv" + tv.id}
                  key={tv.id}
                  whileHover="hover"
                  initial="normal"
                  variants={boxVariants}
                  transition={{ type: "tween" }}
                  bgPhoto={makeImagePath(tv.backdrop_path ?? "", "w500")}
                  onClick={() => onBoxClicked(tv.id)}
                >
                  <Info variants={infoVariants}>
                    <h4>{tv.name}</h4>
                  </Info>
                </Box>
              ))}
          </Row>
        </AnimatePresence>
      </Slider>
    </>
  );
}

function Tv() {
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/tv/:tvId");
  const { scrollY } = useViewportScroll();

  const { data: airingData, isLoading: airingLoading } = useQuery<IGetTvResult>({
    queryKey: ["tv", "airing_today"],
    queryFn: () => getTvShows("airing_today"),
  });

  const { data: popularData, isLoading: popularLoading } = useQuery<IGetTvResult>({
    queryKey: ["tv", "popular"],
    queryFn: () => getTvShows("popular"),
  });

  const { data: topRatedData, isLoading: topRatedLoading } = useQuery<IGetTvResult>({
    queryKey: ["tv", "top_rated"],
    queryFn: () => getTvShows("top_rated"),
  });

  const { data: onAirData, isLoading: onAirLoading } = useQuery<IGetTvResult>({
    queryKey: ["tv", "lastest"],
    queryFn: () => getTvShows("latest"),
  });

  const [airingIndex, setAiringIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topRatedIndex, setTopRatedIndex] = useState(0);
  const [onAirIndex, setOnAirIndex] = useState(0);

  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };

  const onOverlayClick = () => navigate("/tv");

  const tvId = bigTvMatch?.params.tvId;
  const allTvShows = [
    ...(airingData?.results ?? []),
    ...(popularData?.results ?? []),
    ...(topRatedData?.results ?? []),
    ...(onAirData?.results ?? []),
  ];
  const clickedTv = tvId ? allTvShows.find((tv) => tv.id === +tvId) : null;

  const isLoading = airingLoading || popularLoading || topRatedLoading || onAirLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* 배너 */}
          <Banner
            bgPhoto={makeImagePath(airingData?.results[0]?.backdrop_path || "")}
            onClick={() => {
              const len = airingData?.results.length ?? 0;
              if (len > 1)
                setAiringIndex((prev) =>
                  prev === Math.floor((len - 1) / offset) - 1 ? 0 : prev + 1
                );
            }}
          >
            <Title>{airingData?.results[0]?.name}</Title>
            <Overview>{airingData?.results[0]?.overview}</Overview>
          </Banner>

          {/* 슬라이더 */}
          <TvSlider
            title="Airing Today"
            data={(airingData?.results ?? []).slice(1)}
            index={airingIndex}
            setIndex={setAiringIndex}
            onBoxClicked={onBoxClicked}
            leaving={leaving}
            toggleLeaving={toggleLeaving}
          />
          <TvSlider
            title="Popular"
            data={popularData?.results ?? []}
            index={popularIndex}
            setIndex={setPopularIndex}
            onBoxClicked={onBoxClicked}
            leaving={leaving}
            toggleLeaving={toggleLeaving}
          />
          <TvSlider
            title="Top Rated"
            data={topRatedData?.results ?? []}
            index={topRatedIndex}
            setIndex={setTopRatedIndex}
            onBoxClicked={onBoxClicked}
            leaving={leaving}
            toggleLeaving={toggleLeaving}
          />
          <TvSlider
            title="On The Air"
            data={onAirData?.results ?? []}
            index={onAirIndex}
            setIndex={setOnAirIndex}
            onBoxClicked={onBoxClicked}
            leaving={leaving}
            toggleLeaving={toggleLeaving}
          />

          {/* 상세 모달 */}
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                <BigMovie layoutId={"tv" + tvId} style={{ top: scrollY.get() + 100 }}>
                  {clickedTv && (
                    <>
                      <BigCover
                        bgPhoto={clickedTv.backdrop_path ? makeImagePath(clickedTv.backdrop_path, "w500") : ""}
                      />
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
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

export default Tv;