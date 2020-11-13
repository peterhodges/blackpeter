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
    cards?: Card[];
}

export interface GameState {
    id: string;
    started: boolean;
    turn: Player | false;
    players: Player[];
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
    create: (id: string): GameState => {
        return {
            id,
            players: [],
            started: false,
            turn: false,
        }
    },

    addPlayer: (state: GameState, name: string): GameState => {
        if(state.started) throw "Game is already started";
        return {
            ...state,
            players: [
                ...state.players,
                {
                    name,
                    cards: [],
                }
            ]
        }
    },

    start: (state: GameState): GameState => {
        if(state.started) throw new Error("Game is already started");
        if(state.players.length < 2) throw new Error("2 players minimum");

        // @ts-ignore
        // todo: look at this TS issue
        let deck = [].concat(Deck);
        shuffle(deck);

        state = dealCards(state, deck);

        return {
            ...state,
            started: true,
            turn: state.players[0],
        }
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