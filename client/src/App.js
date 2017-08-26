import React, { Component } from "react";
import Board from "./Board";
import Client from "./Client";

import SelectedFoods from "./SelectedFoods";
import FoodSearch from "./FoodSearch";

import api from "./servercom";

class App extends Component {
  state = {
    selectedFoods: [],
    game: { board: [] },
    me: "A"
  };

  constructor () {
    console.log( "App constructor" );
    Client.get_game(game => {
      this.setState({
        game: game
      });
    });
    super();

    Window.App = this;
  }

  move_attempt = (r,c) => {
    var self = this;
    var game = this.state.game;
    if ( game.status === "progress"
          && game.player === this.state.me ) {
          console.log( "request a move: " + "r" + r + " c" + c );
          api.post( "/api/move", { row: r, col: c, user: this.state.me } )
          .then(function(data) { 
              console.log("response data:");
              console.log(data);
              self.setState({game: data});
          });
    }
  }

  removeFoodItem = itemIndex => {
    const filteredFoods = this.state.selectedFoods.filter(
      (item, idx) => itemIndex !== idx
    );
    this.setState({ selectedFoods: filteredFoods });
  };

  addFood = food => {
    const newFoods = this.state.selectedFoods.concat(food);
    this.setState({ selectedFoods: newFoods });
  };

  render() {
    const { selectedFoods } = this.state;

    return (
      <div className="App">

        <Board game={this.state.game}/>

        <div className="ui text container">
          <p>Some not so nice text. Plain text.</p>

          <SelectedFoods
            foods={selectedFoods}
            onFoodClick={this.removeFoodItem}
          />
          <FoodSearch onFoodClick={this.addFood} />
        </div>
      </div>
    );
  }
}

export default App;
