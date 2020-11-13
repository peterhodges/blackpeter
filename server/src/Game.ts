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
    name: string;
    cards: Card[];
}

export interface PendingPlayer {
    name: string;
}

export interface GameState {
    id: string;
    started: boolean;
    turn: Player;
    players: Player[];
}

export interface PendingGameState {
    id: string;
    players: PendingPlayer[];
}

// todo: Have a separate StagingGame and Game type so we don't have to check for undefined everwhere

const shuffle = (array: any) => {
    var i = 0
        , j = 0
        , temp = null
    
    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }   
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
                cards: []
            }
        }

        newState = {
            ...state,
            started: true,
            players: state.players.map(player => initCards(player)),
            turn: initCards(state.players[0]),
        }


        // @ts-ignore
        // todo: look at this TS issue
        let deck = [].concat(Deck);
        shuffle(deck);

        newState = dealCards(newState, deck);

        return newState;
    },

    takeCard: (state: GameState, player: Player) =>  {
        // check for winner
    },

    layPair: (state: GameState, card: Card) => {
        // check for winner
    },

}

function dealCards(state: GameState, deck: Card[]): GameState {
    let deckIndex = 0;
    let playerIndex = 0;

    while(true) {
        // Deal first card to player at index
        state.players[playerIndex] = {
            ...state.players[playerIndex],
            // todo: look at this TS issue
            // @ts-ignore;
            cards: state.players[playerIndex].cards.concat(deck[deckIndex])
        }

        // Move to next card and player (loop players)
        deckIndex++;
        playerIndex < state.players.length-1 ? playerIndex++ : playerIndex = 0;

        if(deckIndex === deck.length) return state;
    };
}