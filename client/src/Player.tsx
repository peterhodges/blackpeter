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

    const playerPairs = player.pairs.map(pair => (
        <div className='player__pair'>
            <Card key={pair[0].id} card={pair[0]} />
            <Card key={pair[1].id} card={pair[1]} />
        </div>
    ));
    const playerCards = player.cards.map(card => <Card key={card.id} card={card} selectCard={selectCard} />);

    return (
        <div className={turn ? 'player player--turn' : 'player'}>
            <div className='player__name'>{player.name}</div>
            <div className='player__cards'>{playerCards}</div>
            <div className='player__pairs'>{playerPairs}</div>
        </div>
    )
};

export default Player;