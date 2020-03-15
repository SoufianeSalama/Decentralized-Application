import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

})

class App extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
          Hello World
      </div>
    )
  }
}

export default withStyles(styles)(App);