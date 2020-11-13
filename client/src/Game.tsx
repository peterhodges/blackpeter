import React, { useState, useEffect } from 'react';
import { GameState, Card as ICard, Player as IPlayer } from './../../server/src/Game';
import socketIOClient from 'socket.io-client';
import Player from './Player';
import './Game.css';

function Game() {
    const [game, setGame] = useState<GameState>();
    // @ts-ignore
    const socket = socketIOClient("http://localhost:3000");

    useEffect(() => {
        socket.on("newState", (data: GameState) => {
            console.log("New state from server: ", data);
            setGame(data);
        });
        return () => socket.close();
    }, []);


    function selectCard(card: ICard, player: IPlayer) {
        console.log("EMIT: SELECT_CARD");
        socket.emit("action", {
            type: "SELECT_CARD",
            card: card,
            player: player,
        });
    }

    function isTurn(player: IPlayer) {
        if(!game) return false;
        return player.name === game.turn.name;
    }

    if(game) {
        return (
            <div className="game">
                <h1>Black Peter</h1>
                <div className="game__players">
                    {game.players.map(player => {
                        return (
                            <Player player={player} turn={isTurn(player)} selectCardFromPlayer={selectCard} />
                        )
                    })}
                </div>
            </div>
            
        );
    } else {
        return (<div>Loading game...</div>);
    }
}
    

export default Game;

