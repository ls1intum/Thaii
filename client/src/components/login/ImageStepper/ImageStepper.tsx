import { Box, Button, Grid, MobileStepper, Typography } from "@mui/material";
import Chatbot from "../../../assets/chatbot.svg";
import Pages from "../../../assets/pages.svg";
import Statistics from "../../../assets/statistics.svg";
import { useState } from "react";
import { autoPlay } from "react-swipeable-views-utils";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import SwipeableViews from "react-swipeable-views";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const images = [
  {
    title: "Ask the Chatbot",
    description: "Use the chatbot to have your questions answered.",
    imgPath: Chatbot,
  },
  {
    title: "Organize your Chats",
    description:
      "Use the pages to organize your chats and find them again quickly.",
    imgPath: Pages,
  },
  {
    title: "Get Insights about your ChatBot Usage",
    description: "Reflect on your use of the ChatBot with various statistics.",
    imgPath: Statistics,
  },
];

function ImageStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Grid
      container
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {images.map((step, index) => (
          <div key={step.title}>
            {Math.abs(activeStep - index) <= 2 ? (
              <>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Box
                    component="img"
                    sx={{
                      display: "block",
                      maxWidth: "25vw",
                      overflow: "hidden",
                      width: "100%",
                    }}
                    src={step.imgPath}
                    alt={step.title}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography variant="h6" color="#5a5a5a">
                    <b>{step.title}</b>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography variant="body1" color="#7f7f7f">
                    {step.description}
                  </Typography>
                </Grid>
              </>
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>

      <MobileStepper
        steps={maxSteps}
        variant="dots"
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            style={{ color: "#5a5a5a", outline: "none", border: "none" }}
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
            style={{ color: "#5a5a5a", outline: "none", border: "none" }}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </Grid>
  );
}

export default ImageStepper;
