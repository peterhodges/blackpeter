import { prependOnceListener } from 'process';
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

    function getClassNames() {
        let classNames = "player";
        if(turn) classNames += " player--turn";
        if(!player.connected) classNames += " player--disconnected";
        console.log(classNames);
        return classNames;
    }

    const playerPairs = player.pairs && player.pairs.map(pair => (
        <div className='player__pair' key={pair[0].id+pair[1].id}>
            <Card card={pair[0]} />
            <Card card={pair[1]} />
        </div>
    ));
    const playerCards = player.cards && player.cards.map(card => <Card key={card.id} card={card} selectCard={selectCard} />);

    return (
        <div className={getClassNames()}>
            <div className='player__name'>{player.id}: {player.name}: {JSON.stringify(player.connected)}</div>
            <div className='player__cards'>{playerCards}</div>
            <div className='player__pairs'>{playerPairs}</div>
        </div>
    )
};

export default Player;