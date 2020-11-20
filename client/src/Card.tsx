import React, {useEffect, useState} from 'react';
import { Card as ICard } from './../../server/src/Game';
import './Card.css';

// todo: Cannot import Game (for CardType enum) with current project dir structure
enum CardType { A, B, C, D, E, F, BP};

interface Props {
    card: ICard;
    selectCard?: (card: ICard) => void;
}

function Card({card, selectCard}: Props) {
    
    const [displayCard, setDisplayCard] = useState("");
    
    useEffect(() => {
        switch(card.type) {
            case CardType.A:
                setDisplayCard("A");
                break;
            case CardType.B:
                setDisplayCard("B");
                break;
            case CardType.C:
                setDisplayCard("C");
                break;
            case CardType.D:
                setDisplayCard("D");
                break;
            case CardType.E:
                setDisplayCard("E");
                break;
            case CardType.F:
                setDisplayCard("F");
                break;
            case CardType.BP:
                setDisplayCard("BP");
                break;
        }
    }, [card]);
    
    function handleClick(e: React.MouseEvent) {
        selectCard && selectCard(card);
    }

    return (
        <div className="card" onClick={handleClick}>{displayCard}</div>
    );
}

export default Card;