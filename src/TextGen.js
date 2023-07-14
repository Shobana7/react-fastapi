import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ModalWait } from "./modalWait";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';


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
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([parentToChild.trim()], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }
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
          <Button onClick={downloadTxtFile}>Save</Button>
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

function TextForm() {
    const [selectedFile, setSelectedFile] = React.useState();
	const [isFilePicked, setIsFilePicked] = React.useState(false);

  const [waitExecuting, setWaitExecuting] = React.useState(false);
    const [resObtained, setResObtained] = React.useState(false);
    const [res, setRes] = React.useState('');

    const parentToChild = (res) => {
      setRes(res);
    }

    const changeHandler = (event) => {

		setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
        const file = event.target.files[0]
        const size = file.size;
        console.log(size);
        //added a max file size limit of 100Kb
        if (size > 15728640) {
          alert("File must not be larger than 15MB")
          return
        }
	};

	const handleSubmission = async (event) => {
        event.preventDefault();
        setWaitExecuting(true);
		const formData = new FormData();

		formData.append('file', selectedFile);

		await fetch(
			'/transcriptgen',
			{
				method: 'POST',
        body: formData,
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
        setWaitExecuting(false); 
        setResObtained(true);
        parentToChild(result['Transcript']);
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
        <Grid item xs={12} >
        {isFilePicked ? (
                  <p></p>
			) : (
				<p>Upload audio file less than 15MB</p>
			)}
            <input type="file" name="file" onChange={changeHandler} />
        </Grid>
        <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={handleSubmission}>
                            Submit
        </Button>
        </Grid>
       </Grid>
    </React.Fragment>
  );
}

export default function TextGen(){
    return(
<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Transcipt Sales Calls
          </Typography>
        <TextForm />
        </Paper>
      </Container>
    );
}