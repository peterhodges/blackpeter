import React, { useState, useEffect } from 'react';
import { GameState, Card as ICard, Player as IPlayer } from './../../server/src/Game';
import socketIOClient from 'socket.io-client';
import Player from './Player';
import './Game.css';
// @ts-ignore
const socket = socketIOClient("http://localhost:3000");

function Game() {
    const [game, setGame] = useState<GameState>();

    const newStateHandler = (data: GameState) => setGame(data);
    useEffect(() => {
        socket.on("newState", newStateHandler);
        return () => socket.off("newState", newStateHandler);
    }, []);

    function selectCard(card: ICard, player: IPlayer) {
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
        if(game.loser) {
            return (<div>Loser: <Player player={game.loser} turn={false} /></div>);
        } else {
            return (
                <div className="game">
                    <h1>Black Peter</h1>
                    <div className="game__players">
                        {game.players.map(player => {
                            return (
                                <Player player={player} key={player.id} turn={isTurn(player)} selectCardFromPlayer={selectCard} />
                            )
                        })}
                    </div>
                </div>
                
            );
        }
    } else {
        return (<div>Loading game...</div>);
    }
}
    

export default Game;

