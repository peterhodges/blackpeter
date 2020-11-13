import React from 'react';
import { GameState } from './../../server/src/Game';

interface Props {
    game: GameState
}

function Game({game}: Props) {
    return (
        <div>
            {game.players ? game.players.map(player => {
                return (
                    <div className='player'>
                        <span>{player.name}: </span>
                        <span>{JSON.stringify(player.cards)}</span>
                        <br/>
                    </div>
                )
            }): null}
        </div>
    );
}

export default Game;

