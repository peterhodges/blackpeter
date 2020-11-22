import React, { useState, useEffect, SyntheticEvent } from 'react';
import { GameState, Card as ICard, Player as IPlayer } from './../../server/src/Game';
import socketIOClient from 'socket.io-client';
import {useParams} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import Player from './Player';
import './Game.css';

// todo: import once project structure fixed
export enum GameStatus { STAGING, PLAYING, PAUSED, FINISHED }


let socket: any;

function Game() {

    const { id } = useParams<{id?: string}>();
    const [game, setGame] = useState<GameState>();
    const [displayUserId, setDisplayUserId] = useState<string>("");
    const newStateHandler = (data: GameState) => setGame(data);
    let userId = "";

    function connect() {
        // @ts-ignore
        socket = socketIOClient(`http://192.168.0.5:3000?game=${id}`);
        const sessionUserId = sessionStorage.getItem("userId"); 
        const guid = uuidv4();

        if(sessionUserId) {
            userId = sessionUserId;
        } else {
            sessionStorage.setItem("userId", guid);
            userId = guid;
        }
        setDisplayUserId(userId);

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

    function newGame() {
        socket.emit("action", {
            type: "NEW_GAME",
        });
    }

    function isTurn(player: IPlayer) {
        if(!game) return false;
        return game.status !== GameStatus.STAGING && player.id === game.turn.id;
    }

    function isUser(player: IPlayer) {
        return player.id === displayUserId;
    }

    let timeout: any;
    function changeName(event: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            socket.emit("action", {
                type: "SET_NAME",
                name: event.target.value,
                userId: displayUserId,
            });    
        }, 600);
    }

    function startGame() {
        socket.emit("action", {
            type: "START_GAME",
        });
    };

    if(game) {
        return (
            <>
                <h1>Black Peter: {id}</h1>
                <div className="game__controls">
                    <button onClick={() => startGame()} disabled={game.status === GameStatus.PLAYING}>Start game</button>
                    <button onClick={() => newGame()}>New game</button>
                    <button onClick={() => disconnect()}>Disconnect</button>
                    <button onClick={() => connect()}>Connect</button>
                    <input onChange={(event) => changeName(event)}></input>
                </div>
                <div className="game">
                    <div className="game__players">
                        {game.players.map(player => {
                            return (
                                <Player player={player} key={player.id} me={isUser(player)} turn={isTurn(player)} selectCardFromPlayer={selectCard} />
                            )
                        })}
                    </div>
                </div>
                {game.loser && <div>Loser: <Player player={game.loser} turn={false} /></div>}
            </>
        )

    } else {
        return (<div>Loading game...</div>);
    }
}
    

export default Game;

