import {
    Chip,
    Grid,

} from "@mui/material";


type ChipGridProps = {
    urls: string[];
}


export const ChipGrid = (props: ChipGridProps) => {
    return (
        <Grid container spacing={1}>
            {props.urls.map((url, index) => (
                <Grid item key={index}>
                    <Chip
                        label={url}
                        component="a"
                        href={url}
                        clickable
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                </Grid>
            ))}
        </Grid>
    );
}