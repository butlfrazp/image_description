import React from 'react';
import {
  Button,
  Box,
  Container,
  CircularProgress,
  TextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';

import { useFeedback } from './hooks/useFeedback';
import { Rating } from './models/feedbackItem';


type FeedbackForm = {
  feedback?: string | undefined;
  rating: Rating;
}

const schema = yup.object().shape({
  rating: yup.string().required().oneOf([Rating.THUMBS_UP, Rating.THUMBS_DOWN]),
  feedback: yup.string().when('rating', {
    is: (value: Rating) => value === Rating.THUMBS_DOWN,
    then: () => yup.string().required().min(10),
  }),
});

const sessionId = uuidv4();

function App() {
  const { handleSubmit, control, reset } = useForm<FeedbackForm>({
    defaultValues: {
      feedback: '',
      rating: Rating.UNKNOWN,
    },
    resolver: yupResolver(schema),
  });

  const { feedbackIds, feedbackItem, loading, submitFeedback, getFeedbackItem, skipFeedbackItem } = useFeedback();

  const onSubmit = async (data: FeedbackForm) => {
    if (!feedbackItem) {
      return;
    }

    await submitFeedback(sessionId, data.feedback ?? "", data.rating);
    reset();
  }

  const renderLoading = () => {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="App">
      {(!loading && feedbackIds?.length === 0) && <h1>No feedback items available</h1>}
      {(loading || !feedbackItem) && (feedbackIds ?? []).length > 0 && renderLoading()}
      {!loading && feedbackItem && (feedbackIds ?? []).length > 0 && (
        <Container>
          <Box component="form" sx={{
              mt: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <h1>Feedback</h1>
            <FormControl sx={{
              width: '100%',
              height: '100%',
              maxWidth: '300px',
              mt: 2,
            }}>
              <FormLabel>Image</FormLabel>
              <img src={feedbackItem.imageData} alt="Image for gpt analysis" />
            </FormControl>
            <FormControl sx={{
              width: '100%',
              height: '100%',
              maxWidth: '600px',
              mt: 2,
            }}>
              <FormLabel>GPT Description</FormLabel>
              <TextField
                multiline
                rows={4}
                placeholder="GPT Description"
                disabled
                value={feedbackItem.description}
                sx={{
                  '& .MuiInputBase-root.Mui-disabled': {
                    color: '#414141'
                  }
                }}
              />
            </FormControl>
            <Controller
              name="rating"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl sx={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '600px',
                  mt: 2,
                }}
                error={!!error}
                >
                  <FormLabel>Rating</FormLabel>
                  <RadioGroup
                    row
                    value={value}
                    onChange={onChange}
                  >
                    <FormControlLabel
                      value={Rating.THUMBS_UP}
                      control={<Radio />}
                      label="Like"
                    />
                    <FormControlLabel
                      value={Rating.THUMBS_DOWN}
                      control={<Radio />}
                      label="Dislike"
                    />
                  </RadioGroup>
                  <FormHelperText>{!!error ? "You must either Like or Dislike the Description." : ""}</FormHelperText>
              </FormControl>
            )} />
            <FormControl sx={{
              width: '100%',
              height: '100%',
              maxWidth: '600px',
              mt: 2,
            }}>
              <FormLabel>Feedback</FormLabel>
              <Controller
                name="feedback"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    multiline
                    rows={4}
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    value={value}
                    fullWidth
                    variant="outlined"
                    placeholder="This description gives an accurate representation of the image."
                  />
                )}
              />
            </FormControl>
            <Box sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              mt: 2,
              '& button': { mx: 1 }
            }}>
              <Button variant="contained" size="large" onClick={handleSubmit(onSubmit)}>Submit</Button>
              <Button variant="outlined" size="large" onClick={() => skipFeedbackItem()}>Skip</Button>
            </Box>
          </Box>
        </Container>
      )}
    </div>
  );
}

export default App;
