import React from 'react';
import { GameState } from './../../server/src/Game';

interface Props {
    game?: GameState
}

function Game({game}: Props) {
    if(game) {
        return (
            <div>
                {game.players.map(player => {
                    return (
                        <div className='player'>
                            <span>{player.name}: </span>
                            <span>{JSON.stringify(player.cards)}</span>
                            <br/>
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (<div></div>);
    }
}
    

export default Game;

