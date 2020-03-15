import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { fade, withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import DialogActions from '@material-ui/core/DialogActions';


const styles = theme => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },
      },
      searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
      },
      inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
          width: 200,
        },
      },
      title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
          display: 'block',
        },
      },
      grow: {
        flexGrow: 1,
      },
})

class NavBar extends React.Component {
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
        <AppBar position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    Decentralized Application: Asset Tracker
                </Typography>
                
                <div className={classes.grow} />
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                    <SearchIcon />
                    </div>
                    <InputBase
                    placeholder="Search for group..."
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                    />
                </div>

                <Button color="inherit" onClick={this.openDialog.bind(this)}>Create a new group</Button>

            </Toolbar>
        </AppBar>

        <Dialog open={this.state.open} onEnter={console.log("Hey.")}>
          <DialogTitle>New group</DialogTitle>
                <DialogContent>
                    <form  noValidate autoComplete="off">
                          <InputLabel>Group ID</InputLabel>
                          <TextField  variant="outlined"
                          />
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

export default withStyles(styles)(NavBar);