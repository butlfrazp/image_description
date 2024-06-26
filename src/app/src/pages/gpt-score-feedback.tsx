import React from 'react';
import {
  Button,
  Box,
  Container,

  TextField,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Autocomplete,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';

import { NotFound } from '../components/notFound';
import { useGptScoreFeedback } from '../hooks/useGptScoreFeedback';
import { Spinner } from '../components/spinner';
import { ChipGrid } from '../components/chip-grid';

const _FEEDBACK_OPTIONS = [
    "The answer is incorrect.",
    "The answer is partially correct.",
    "All of the images are irrelevant.",
    "Some of the images are irrelevant.",
    "Too much information.",
    "Not enough information.",
    "Other"
]

type FeedbackForm = {
  note?: string | undefined;
  feedbackOptions?: (string | undefined)[] | undefined;
  score: number;
}

const schema = yup.object().shape({
  score: yup.number().required().min(1).max(5),
  feedbackOptions: yup.array().of(yup.string()).when('score', {
    is: (value: number) => value <= 3,
    then: () => yup.array().of(yup.string()).required().min(1),
  }),
  note: yup.string().when('feedbackOptions', {
    is: (value: string[]) => value.includes("Other"),
    then: () => yup.string().required().min(10),
  }),
});

const sessionId = uuidv4();

export const GptScoreFeedback = () => {
  React.useEffect(() => {
    document.title = "Correctness Feedback";
  }, [])

  const { version } = useParams<{ version: string }>();

  if (!version) {
    throw new Error("No version provided.");
  }

  const { handleSubmit, control, reset } = useForm<FeedbackForm>({
    defaultValues: {
      score: undefined,
      feedbackOptions: [],
      note: undefined
    },
    resolver: yupResolver(schema),
  });

  const {
    gptScoreFeedbackIds,
    gptScoreFeedbackItem,
    isLoading,
    submitFeedback,
    skipFeedbackItem,
    versionExists
    } = useGptScoreFeedback(version);

  const onSubmit = async (data: FeedbackForm) => {
    if (!gptScoreFeedbackItem) {
      return;
    }

    await submitFeedback(sessionId, data.feedbackOptions?.join(', ') ?? "", data.note ?? "", data.score);
    reset();
  }

  if (isLoading) {
    return <Spinner visible={true} />;
  }

  if (versionExists === false) {
    return <NotFound />;
  }

  if (!isLoading && gptScoreFeedbackIds?.length === 0) {
    return <h1>No feedback items available</h1>;
  }

  return (
    <div>
        <Container>
          <Box component="form" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
            mb: 30
          }}>
            <Typography variant="h5" component="h2">Correctness Score Feedback</Typography>

            <FormControl sx={{
              width: '100%',
              maxWidth: '600px',
              mt: 2,
            }}>
              <FormLabel>Question</FormLabel>
              <TextField
                multiline
                rows={2}
                disabled
                value={gptScoreFeedbackItem?.question}
                sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#4a4a4a",
                  },
                }}
              />
            </FormControl>

            <FormControl sx={{
              width: '100%',
              maxWidth: '600px',
              mt: 2,
            }}>
              <FormLabel>Answer</FormLabel>
              <TextField
                multiline
                rows={8}
                disabled
                value={gptScoreFeedbackItem?.generatedAnswer}
                sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "#4a4a4a",
                  },
                }}
              />
            </FormControl>

            <Box sx={{
                width: '100%',
                maxWidth: '600px',
                mt: 2
            }}>
                <FormLabel>Image URLs</FormLabel>
                <Box
                    sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 125,
                    overflowX: "scroll",
                    overflowY: "scroll",
                    // justifyContent="flex-end" # DO NOT USE THIS WITH 'scroll'
                    }}
                >
                    <ChipGrid urls={gptScoreFeedbackItem?.imageLinks ?? []} />
                </Box>
            </Box>

            <Controller
                name="score"
                control={control}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <FormControl sx={{
                        width: '100%',
                        maxWidth: '600px',
                        mt: 2,
                      }}
                      error={!!error}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <FormLabel id="gpt-score">Score <Typography variant='caption' component='span'>(Required)</Typography></FormLabel>
                          <Tooltip title="Score from 1 to 5 where 1 is the lowest score and 5 is the highest score. The score is based on if the answer and images are correct, accurate, and factual."><IconButton><InfoOutlined /></IconButton></Tooltip>
                        </div>
                        <RadioGroup
                            row
                            aria-labelledby="gpt-score"
                            name="radio-buttons-group"
                            value={value}
                            onChange={onChange}
                            sx={{
                                margin: "auto"
                            }}
                        >
                            <FormControlLabel value="1" control={<Radio />} label="1" />
                            <FormControlLabel value="2" control={<Radio />} label="2" />
                            <FormControlLabel value="3" control={<Radio />} label="3" />
                            <FormControlLabel value="4" control={<Radio />} label="4" />
                            <FormControlLabel value="5" control={<Radio />} label="5" />
                        </RadioGroup>
                        <FormHelperText>{error?.message}</FormHelperText>
                    </FormControl>
            )} />

            <Controller
                name="feedbackOptions"
                control={control}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <FormControl sx={{
                            width: '100%',
                            maxWidth: '600px',
                            mt: 2,
                            position: 'relative'
                        }}>
                        <FormLabel>Feedback <Typography variant='caption' component='span'>(Required if Score &#8804; 3)</Typography></FormLabel>
                        <Autocomplete
                            multiple
                            disablePortal
                            disableCloseOnSelect
                            options={_FEEDBACK_OPTIONS}
                            renderInput={(params) => (<TextField
                              {...params}
                              error={!!error}
                              helperText={error?.message}
                              variant="outlined"
                            />)}
                            onChange={(_, data) => onChange(data)}
                            value={value}
                            fullWidth
                        />
                    </FormControl>
                )}
            />

            <Controller
                name="note"
                control={control}
                render={({
                    field: { onChange, value },
                    fieldState: { error },
                }) => (
                    <FormControl sx={{
                        width: '100%',
                        maxWidth: '600px',
                        mt: 2,
                        display: 'flex',
                    }}>
                        <FormLabel>Note <Typography variant='caption' component='span'>(Required if Feedback contains "Other")</Typography></FormLabel>
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
                            placeholder="Add additional notes on the score feedback here."
                        />
                    </FormControl>
                )}
            />

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
    </div>
  );
}
