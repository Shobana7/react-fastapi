import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import { ModalWait } from "./modalWait";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
function ChildModal({parentToChild}) {
  
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <React.Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <h2 id="child-modal-title">Response</h2>
          <p id="child-modal-description">
            <div style={{whiteSpace: "pre-line"}}>
            {parentToChild.trim()}
          </div>
          </p>
          <Button onClick={() => {navigator.clipboard.writeText(parentToChild.trim())}}><ContentCopyIcon/></Button>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function PostForm() {
    const [context, setContext] = React.useState('');
    const [platform, setPlatform] = React.useState('');

    const [waitExecuting, setWaitExecuting] = React.useState(false);
    const [resObtained, setResObtained] = React.useState(false);
    const [res, setRes] = React.useState('');

  const handlePlatform = (event) => {
    setPlatform(event.target.value);
  };
  
  const parentToChild = (res) => {
    setRes(res);
  }
  const handleContext = (event) => {
    setContext(event.target.value);
  };

  const handleClear = () => {
    setContext('');
    setPlatform('');
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    setWaitExecuting(true);
const data = {'context': context,
'platform': platform
};

await fetch(
  '/postgen',
  {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json' }
  }
)
  .then((response) => response.json())
  .then((result) => {
    console.log('Success:', result);
    setWaitExecuting(false); 
    setResObtained(true);
    parentToChild(result['Post']);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

  return (
    <React.Fragment>
      {waitExecuting ? (
        <ModalWait/>
      ) : (resObtained) ? <ChildModal parentToChild={res}/> : null}
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
        <FormControl variant="standard" fullWidth>
        <InputLabel id="demo-simple-select-standard-label">Platform *</InputLabel>
        <Select
          required
          labelId="demo-simple-select-standard-label"
          id="platform"
          value={platform}
          onChange={handlePlatform}
          label="platform"
        >
          <MenuItem value={'Facebook'}>Facebook</MenuItem>
          <MenuItem value={'Instagram'}>Instagram</MenuItem>
          <MenuItem value={'Twitter'}>Twitter</MenuItem>
          <MenuItem value={'Threads'}>Threads</MenuItem>
        </Select>
      </FormControl>
        </Grid>
        <Grid item xs={12}>
        <TextField
          multiline
            required
            id="context"
            name="context"
            value={context}
            onChange={handleContext}
            label = "Provide context"
            placeholder=""
            fullWidth
            variant="outlined"
            inputProps={
                {
                    style:{
                        height: "150px",
                    }
                }
            }
          />
        </Grid>
        <Grid item xs={12} sm={3}>
        <Button type="submit" disabled={!context} variant="contained"  onClick={handleSubmission}>
                            Create
        </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
        <Button variant="contained"  onClick={handleClear}>
                            Clear
        </Button>
        </Grid>
       </Grid>
    </React.Fragment>
  );
}

export default function PostGen(){


    return(
<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Create Post
          </Typography>
        <PostForm />
        </Paper>
      </Container>
    );
}