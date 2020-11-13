import React from 'react';
import { Player as IPlayer, Card as ICard } from './../../server/src/Game';
import Card from './Card';
import './Player.css';

interface Props {
    player: IPlayer;
    turn: boolean;
    selectCardFromPlayer?: (card: ICard, player: IPlayer) => void;
}

function Player({player, turn, selectCardFromPlayer}: Props) {

    function selectCard(card: ICard) {
        selectCardFromPlayer && selectCardFromPlayer(card, player);
    }

    return (
        <div className={turn ? 'player player--turn' : 'player'}>
            <div className='player__name'>{player.name}</div>
            <div className='player__cards'>
                {player.cards ? player.cards.map(card => <Card card={card} selectCard={selectCard} />) : "No cards"}
            </div>
        </div>
    )
};

export default Player;