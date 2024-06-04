import { createBrowserRouter } from "react-router-dom";
import { ImageDescriptionFeedback } from "./pages/image-description-feedback";
import { GptScoreFeedback } from "./pages/gpt-score-feedback";


export const router = createBrowserRouter([
  {
    path: '/image-feedback/feedback/image/:version',
    element: <ImageDescriptionFeedback />
  },
  {
    path: '/image-feedback/feedback/gpt-score/:version',
    element: <GptScoreFeedback />
  }
]);
