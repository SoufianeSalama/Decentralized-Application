import React, { Component } from 'react'
import NavBar from './components/NavBar'
import AssetInfo from './components/AssetInfo';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

})

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <NavBar className={classes.nav}/>
        <br/>
        <br/>
        <AssetInfo />
      </div>
    )
  }
}

export default withStyles(styles)(App);