import React from "react";

class Cell extends React.Component {
  state = {};
  
  onclick = (e) => {
    console.log( "clicked on " + this.props.row + "x" + this.props.col );
    Window.App.move_attempt( this.props.row, this.props.col );
  }

  render () {
    return <div className={"cell " + this.props.value} onClick={this.onclick}> </div>
  }
}

class Board extends React.Component {
  state = {};

  render() {

    var game = this.props.game;
    var board = game.board;

    var rows = board.map( (r, rowi) => {
  
      var cells = r.map( (c, celli) => {
          var key="r"+rowi+"c"+celli;
          //console.log( key );

          return <Cell key={key} value={c} row={rowi} col={celli}/>
        });

        return <div className='row' key={"r"+rowi}>
            { cells }
          </div>
    });
       

    return (
      <div id='board'>
        { rows }
      </div>
    );
  }
}

export default Board;
