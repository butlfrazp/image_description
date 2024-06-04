import { Box, CircularProgress } from "@mui/material";


type SpinnerProps = {
    visible: Boolean;
}

export const Spinner = (props: SpinnerProps) => {
    if (!props.visible) {
        return null;
    }

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