import React, { useState, useEffect } from 'react';
import { GameState, Card as ICard, Player as IPlayer } from './../../server/src/Game';
import socketIOClient from 'socket.io-client';
import {useParams} from "react-router-dom";
import Player from './Player';
import './Game.css';

// todo: import once project structure fixed
export enum GameStatus { STAGING, PLAYING, PAUSED, FINISHED }


let socket: any;

function Game() {

    const { id } = useParams<{id?: string}>();

    const [game, setGame] = useState<GameState>();

    const newStateHandler = (data: GameState) => setGame(data);

    function connect() {
        // @ts-ignore
        socket = socketIOClient(`http://localhost:3000?game=${id}`);
        let userId = sessionStorage.getItem("userId"); 
        if(!userId) {
            userId = Math.random()+""; // todo: use guid
            sessionStorage.setItem("userId", userId);
        }  
        socket.emit("ehlo", userId);
        socket.on("newState", newStateHandler);
    }

    function disconnect() {
        socket.disconnect();
        socket.off("newState", newStateHandler);
    }

    useEffect(() => {
        connect();
        return () => disconnect();
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
        return game.status !== GameStatus.STAGING && player.id === game.turn.id;
    }

    function startGame() {
        socket.emit("action", {
            type: "START_GAME",
        });
    };

    if(game) {
        if(game.loser) {
            return (<div>Loser: <Player player={game.loser} turn={false} /></div>);
        } else {
            return (
                <div className="game">
                    <h1>Black Peter: {id}</h1>
                    <div className="game__controls">
                        <button onClick={() => startGame()}>Start game</button>
                        <button onClick={() => disconnect()}>Disconnect</button>
                        <button onClick={() => connect()}>Connect</button>
                    </div>
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

