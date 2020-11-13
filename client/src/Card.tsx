import React, {useEffect, useState} from 'react';
import { Card as ICard } from './../../server/src/Game';
import './Card.css';

interface Props {
    card: ICard;
    selectCard?: (card: ICard) => void;
}

function Card({card, selectCard}: Props) {
    
    const [displayCard, setDisplayCard] = useState("");
    
    useEffect(() => {
        switch(card) {
            case 0:
            case 1:
                setDisplayCard("A");
                break;
            case 2:
            case 3:
                setDisplayCard("B");
                break;
            case 4:
            case 5:
                setDisplayCard("C");
                break;
            case 6:
            case 7:
                setDisplayCard("D");
                break;
            case 8:
            case 9:
                setDisplayCard("E");
                break;
            case 10:
            case 11:
                setDisplayCard("F");
                break;
            case 12:
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