import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { SlideTitleImage, SlideTitleImageProps } from "./SlideTitleImage";
import { SingleSlideImage, SingleSlideImageProps } from "./SingleSlideImage";
import { SlideSummaryImage, SlideSummaryImageProps } from "./SlideSummaryImage";

export type SlideShowVideoProps = {
  titleSlide: SlideTitleImageProps;
  slides: SingleSlideImageProps[];
  summarySlide: SlideSummaryImageProps;
  slideDuration?: number; // frames per slide (default 150 = 5 seconds at 30fps)
  transitionDuration?: number; // frames for crossfade (default 20)
};

// Crossfade transition wrapper
const FadeIn: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, Math.min(20, durationInFrames)], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, Math.min(20, durationInFrames)], [1.05, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      {children}
    </AbsoluteFill>
  );
};

export const SlideShowVideo: React.FC<SlideShowVideoProps> = ({
  titleSlide,
  slides = [],
  summarySlide,
  slideDuration = 150,
  transitionDuration = 20,
}) => {
  const allSlides: React.ReactNode[] = [];

  // 1. Title slide
  allSlides.push(<SlideTitleImage {...titleSlide} />);

  // 2. Character slides
  for (const slide of slides) {
    allSlides.push(<SingleSlideImage {...slide} />);
  }

  // 3. Summary slide
  allSlides.push(<SlideSummaryImage {...summarySlide} />);

  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f4f6" }}>
      {allSlides.map((slideContent, index) => (
        <Sequence
          key={index}
          from={index * (slideDuration - transitionDuration)}
          durationInFrames={slideDuration}
        >
          <FadeIn durationInFrames={slideDuration}>
            {slideContent}
          </FadeIn>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
