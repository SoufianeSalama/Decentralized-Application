import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';

const styles = theme => ({
    title: {
        fontSize: 22,
    },
    pos: {
        marginBottom: 12,
    },
    description:{
        padding: 24,
    },
    heading:{
        fontWeight: 500,
    },
    dialog:{
     
    }
   , inputs:{
       width: '40%'
   }
})

function createData(id, type, description, added_date, location, chemical_data, quality_data) {
    return { id, type, description, added_date, location, chemical_data, quality_data};
}
  
// Assets:
// Type: recycled_scrap, hotrolled_scrap, coldrolled_scrap
const containingAssets = [
createData(1, 'coldrolled_scrap', 'scrap from  White Coil "id:848412"', '1/03/2020 12:15', 'unknown', 
    {
    "nickel" : "15",
    "carbon" :"5",
    "manganese": "20",
    "sulfur" : "2",
    "silicon" : "0",
    "phosphor": "5",
    },{
        "thickness": "1.5mm",
        "width": "200mm",
        "length": "50m",
        "strength" : "400-500"
    }
),
createData(2, 'coldrolled_scrap', 'scrap from  White Coil "id:848412"', '1/03/2020 12:15', 'unknown', 
    {
    "nickel" : "15",
    "carbon" :"5",
    "manganese": "20",
    "sulfur" : "2",
    "silicon" : "0",
    "phosphor": "5",
    },{
        "thickness": "1.5mm",
        "width": "200mm",
        "length": "50m",
        "strength" : "400-500"
    }
)
];

class AssetInfo extends React.Component {
    state = {
        open: false
      };
      openDialog() {
        this.setState({ open: true });
      };
      closeDialog() {
        this.setState({ open: false });
      };

    render() {
      const { classes } = this.props;
      return (
        <div>
            <Container maxWidth="lg">
                <Paper variant="outlined" >

                    <div className={classes.description}>
                        <Button style={{float: 'right' }}  onClick={this.openDialog.bind(this)} variant="contained" color="secondary" >Add asset to this group</Button>

                        <Typography className={classes.title} >
                            Group details: #84684
                        </Typography>
                        
                        <Typography className={classes.pos}>
                            Containing assets: {containingAssets.length}
                        </Typography>

                        <Typography className={classes.pos}>
                            Created by: Soufiane Salama
                        </Typography>

                        <Typography className={classes.pos}>
                            Last modification: {containingAssets[1].added_date}
                        </Typography>
                        
                    
                    </div>

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        >
                        <Typography className={classes.heading}>Quality details</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Asset description</TableCell>
                                    <TableCell>Asset type</TableCell>
                                    <TableCell align="right">Thickness (mm)</TableCell>
                                    <TableCell align="right">Width (mm)</TableCell>
                                    <TableCell align="right">Length (m)</TableCell>
                                    <TableCell align="right">Strength (N/mm²)</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {containingAssets.map(asset => (
                                    <TableRow key={asset.id}>
                                    <TableCell component="th" scope="row">
                                        {asset.description}
                                    </TableCell>
                                    <TableCell align="right">{asset.type}</TableCell>
                                    <TableCell align="right">{asset.quality_data.thickness}</TableCell>
                                    <TableCell align="right">{asset.quality_data.width}</TableCell>
                                    <TableCell align="right">{asset.quality_data.length}</TableCell>
                                    <TableCell align="right">{asset.quality_data.strength}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        >
                        <Typography className={classes.heading}>Chemical composition</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Asset description</TableCell>
                                    <TableCell>Asset type</TableCell>
                                    <TableCell align="right">Nickel (%)</TableCell>
                                    <TableCell align="right">Carbon (%)</TableCell>
                                    <TableCell align="right">Manganese (%)</TableCell>
                                    <TableCell align="right">Sulfur (%)</TableCell>
                                    <TableCell align="right">Silicon (%)</TableCell>
                                    <TableCell align="right">Phosphor (%)</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {containingAssets.map(asset => (
                                    <TableRow key={asset.id}>
                                    <TableCell component="th" scope="row">
                                        {asset.description}
                                    </TableCell>
                                    <TableCell align="right">{asset.type}</TableCell>
                                    <TableCell align="right">{asset.chemical_data.nickel}</TableCell>
                                    <TableCell align="right">{asset.chemical_data.carbon}</TableCell>
                                    <TableCell align="right">{asset.chemical_data.manganese}</TableCell>
                                    <TableCell align="right">{asset.chemical_data.sulfur}</TableCell>
                                    <TableCell align="right">{asset.chemical_data.silicon}</TableCell>
                                    <TableCell align="right">{asset.chemical_data.phosphor}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Paper>
            </Container>

            <Dialog open={this.state.open} fullWidth={true} maxWidth = {'sm'} >
                <DialogTitle>Add asset</DialogTitle>
                
                <DialogContent>
                    <form  noValidate autoComplete="off">
                        <h4>Global info</h4>
                        <Grid container spacing={3}>
                            
                            <Grid item md={6}>
                                <InputLabel>Asset Type</InputLabel>
                                <Select className={classes.inputs} value={"hotrolled_scrap"}>
                                    <MenuItem value='hotrolled_scrap'>Hot rolled scrap</MenuItem>
                                    <MenuItem value='coldrolled_scrap'>Cold rolled scrap</MenuItem>
                                    <MenuItem value='recycled_scrap'>Recycled scrap</MenuItem>
                                </Select>
                            </Grid>

                            <Grid item md={6}>
                                <InputLabel>Asset description</InputLabel>
                                <TextField
                                    multiline
                                    rows="4"
                                    variant="outlined"
                                    />
                            </Grid>
                            
                        </Grid>
                        

                        <h4>Quality details</h4>
                        <Grid container spacing={3}>
                            <Grid item md={6}>
                            <InputLabel>Width</InputLabel>
                                <Input
                                    variant="outlined"
                                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <InputLabel>Length</InputLabel>
                                <Input
                                    variant="outlined"
                                    endAdornment={<InputAdornment position="end">m</InputAdornment>}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                                <Grid item md={6}>
                            <InputLabel>Strength</InputLabel>
                                <Input
                                    variant="outlined"
                                    endAdornment={<InputAdornment position="end">N/mm²</InputAdornment>}
                                />
                            </Grid>

                            <Grid item md={6}>
                                <InputLabel>Thickness</InputLabel>
                                <Input
                                    variant="outlined"
                                    endAdornment={<InputAdornment position="end">mm</InputAdornment>}
                                />
                            </Grid>
                            
                        </Grid>

                        <h4>Chemical composition</h4>    
                                    
                    </form>
                </DialogContent>   
                <DialogActions>
                    <Button onClick={this.closeDialog.bind(this)} color="primary">
                        Cancel
                    </Button>
                    <Button color="secondary">
                        Add
                    </Button>
                </DialogActions>              
            
            </Dialog>
        </div>
    );
  }
}

export default withStyles(styles)(AssetInfo);