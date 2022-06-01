import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  SvgIcon,
  Typography,
} from '@mui/material'

class Tool {
  constructor(
    readonly name: string,
    readonly description: string,
    readonly icon: typeof SvgIcon
  ) {}

  card(): JSX.Element {
    return (
      <Card sx={{ margin: 2 }}>
        <CardActionArea>
          <Grid container direction="row" alignItems="center">
            <Grid item>
              <SvgIcon
                component={this.icon}
                fontSize="large"
                sx={{ margin: 2 }}
              />
            </Grid>
            <Grid item>
              <CardContent>
                <Typography variant="h5" color="text.primary">
                  {this.name}
                </Typography>
                <Typography color="text.secondary">
                  {this.description}
                </Typography>
              </CardContent>
            </Grid>
          </Grid>
        </CardActionArea>
      </Card>
    )
  }
}

const tools: Tool[] = [
  new Tool(
    'Practice Sight Reading',
    'Quickly select the correct names of the notes',
    VisibilityIcon
  ),
  new Tool(
    'Practice Perfect Pitch',
    'Quickly select the correct names of the sound',
    MusicNoteIcon
  ),
  new Tool(
    'Metronome',
    'Configurable metronome simulator',
    HourglassBottomIcon
  ),
]

export default function App() {
  return <div>{tools.map((t) => t.card())}</div>
}
