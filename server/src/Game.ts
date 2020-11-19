import { convertTypeAcquisitionFromJson, hasOnlyExpressionInitializer, textChangeRangeIsUnchanged } from "typescript";

export enum Card {
    "A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "BP"
}

export const Deck: Card[] = [
    Card.A1, Card.A2, 
    Card.B1, Card.B2, 
    Card.C1, Card.C2, 
    Card.D1, Card.D2,
    Card.E1, Card.E2,
    Card.F1, Card.F2,
    Card.BP
];

export interface Player {
    id: number;
    name: string;
    cards: Card[];
}

export interface PendingPlayer {
    id: number;
    name: string;
}

export interface GameState {
    id: string;
    started: boolean;
    turn: Player & {pickedCard: boolean};
    players: Player[];
    winner?: Player;
}

export interface PendingGameState {
    id: string;
    players: PendingPlayer[];
}

export const Game = {
    create: (id: string): PendingGameState => {
        return {
            id,
            players: [],
        }
    },

    addPlayer: (state: PendingGameState, name: string): PendingGameState => {
        return {
            ...state,
            players: [
                ...state.players,
                {
                    id: newId(state.players),
                    name,
                }
            ]
        }
    },

    start: (state: PendingGameState): GameState => {
        if(state.players.length < 2) throw new Error("2 players minimum");

        // Create new GameState
        let newState = <GameState>{};

        const initCards = (player:PendingPlayer): Player => {
            return {
                ...player,
                cards: [],
            }
        }

        newState = {
            ...state,
            started: true,
            players: state.players.map(player => initCards(player)),
            turn: {...initCards(state.players[0]), pickedCard: false}
        }

        newState = dealCards(newState, shuffle(Deck));

        return newState;
    },

    selectCard: (state: GameState, player: Player, card: Card) =>  {
        
        // todo: Support player turns
        // todo: ensure it only pushes states when actually required (fns should return falsy)
        if(player.name === state.turn.name) {
            // Player selecting own cards
            const newState = layCard(state, player, card);
            if(newState) return checkWinner(checkTurn(newState));
        } 
        else {
            const newState = selectOpponentCard(state, player, card);
            if(newState) return checkWinner(checkTurn(newState));
        }
    },

}

function dealCards(state: GameState, deck: Card[]): GameState {
    let deckIndex = 0;
    let playerIndex = 0;

    while(true) {
        // Deal first card to player at index
        state.players[playerIndex] = {
            ...state.players[playerIndex],
            cards: state.players[playerIndex].cards.concat(deck[deckIndex])
        }

        // Move to next card and player (loop players)
        deckIndex++;
        playerIndex < state.players.length-1 ? playerIndex++ : playerIndex = 0;

        if(deckIndex === deck.length) return state;
    };
}

function layCard(state: GameState, player: Player, card: Card): GameState|false {
    // todo: Place cards in "playedCards" array for user
    if(card === Card.BP) return false;

    // Get first letter of card
    const cardLetter = Card[card][0];

    // Find all cards with same first letter (including provided card)
    let matchingCards: Card[] = [];
    player.cards.forEach(playerCard => {
        const playerCardLetter = Card[playerCard][0];
        if(playerCardLetter === cardLetter) {
            matchingCards.push(playerCard);
        };
    });

    // Remove any pairs from user
    if(matchingCards.length === 2) {
        return {
            ...state,
            players: state.players.map(p => {
                if(p.name === player.name) {
                    return {
                        ...p,
                        cards: p.cards.filter(c => matchingCards.indexOf(c) === -1)
                    }
                }
                else { return p; }
            }),
        };
    } 

    return false;
}

function selectOpponentCard(state: GameState, player: Player, card: Card) {
    if(state.turn.pickedCard) return state;

    return {
        ...state,
        turn: {
            ...state.turn,
            pickedCard: true,
        },
        players: state.players.map(p => {
            // Remove card from selected player
            if(p.name === player.name) {
                return {
                    ...p,
                    cards: p.cards.filter(c => c !== card),
                }
            }
            // Add card to turn player
            if(p.name === state.turn.name) {
                return {
                    ...p,
                    cards: [...p.cards, card],
                }
            }
            else { return p; }
        })
    };
}

function shuffle(array: any): any {
    array = [...array];
    var i = 0
        , j = 0
        , temp = null
    
    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }   
    return array;
}

function checkTurn(state: GameState): GameState {
    // Player must:
    // - choose 1 x opponent card
    // - play all pairs in their hand
    const player = state.players.find(player => player.id === state.turn.id);

    if(player) {
        if(state.turn.pickedCard && !containsPair(player.cards)) {
            return {
                ...state,
                turn: {...getNextPlayer(state, state.turn.id), pickedCard: false}
            }
        }
    }

    return state;
}

function checkWinner(state: GameState): GameState {
    // Game is won when there's only one card left (and it's black peter)
    let winner: Player|false = false;

    for (const player of state.players) {
        if(player.cards.length > 1) {
            // At least one person has multiple cards - game is not won
            return state;
        }
        if(player.cards.length === 1 && player.cards[0] === Card.BP) {
            winner = player;
        }
    }

    if(winner) {
        return {
            ...state,
            winner: winner,
        }
    }

    return state;
}

function getNextPlayer(state: GameState, playerId: number): Player {
    // Find index of player
    const index = state.players.findIndex(player => player.id === playerId);
    if(index > -1) {
        // Find index of next player (loop around array);
        const newIndex = index < state.players.length-1 ? index+1 : 0;
        return state.players[newIndex];
    }
    throw new Error("Could not find next player");
}

function containsPair(cards: Card[]): boolean {
    // todo: Implement this
    // How to determine duplicates? Probably need a better data structure for cards...
    return false;
}

function newId(array: {id: number}[]): number {
    return array.reduce((acc: number, curr: {id:number}) => acc === curr.id ? acc + 1 : acc, 0);
}