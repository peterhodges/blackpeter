export enum CardType { A, B, C, D, E, F, BP};
export enum CardId { A1, A2, B1, B2, C1, C2, D1, D2, E1, E2, F1, F2, BP};
export interface Card {
    type: CardType;
    id: CardId;
}

const Deck: Card[] = [
    { type: CardType.A, id: CardId.A1 },
    { type: CardType.A, id: CardId.A2 },
    { type: CardType.B, id: CardId.B1 },
    { type: CardType.B, id: CardId.B2 },
    { type: CardType.C, id: CardId.C1 },
    { type: CardType.C, id: CardId.C2 },
    { type: CardType.D, id: CardId.D1 },
    { type: CardType.D, id: CardId.D2 },
    { type: CardType.E, id: CardId.E1 },
    { type: CardType.E, id: CardId.E2 },
    { type: CardType.F, id: CardId.F1 },
    { type: CardType.F, id: CardId.F2 },
    { type: CardType.BP, id: CardId.BP},
]


export interface Player {
    id: number;
    name: string;
    cards: Card[];
    pairs: Card[][];
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
    loser?: Player;
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
                pairs: [],
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
        if(player.id === state.turn.id) {
            // Player selecting own cards
            const newState = layCard(state, player, card);
            if(newState) return checkLoser(checkTurn(newState));
        } 
        else {
            const newState = selectOpponentCard(state, player, card);
            if(newState) return checkLoser(checkTurn(newState));
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
    if(card.type === CardType.BP) return false;

    const matching = player.cards.filter((playerCard => playerCard.type === card.type));
    const rest = player.cards.filter(playerCard => playerCard.type !== card.type);
    if(matching.length === 2) {
        return {
            ...state,
            players: state.players.map(p => {
                if(p.id === player.id) {
                    return {
                        ...p,
                        cards: rest,
                        pairs: [...p.pairs, matching]
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
            if(p.id === player.id) {
                return {
                    ...p,
                    cards: p.cards.filter(c => c.id !== card.id),
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

function checkLoser(state: GameState): GameState {
    // Game is lost by player holding last card (black peter)
    let cardsInPlay: any[] = [];

    state.players.forEach(player => cardsInPlay = [...cardsInPlay, ...player.cards]);

    if(cardsInPlay.length === 1 && cardsInPlay[0].type === CardType.BP) {
        // game is over
        // determine which player lost
        const loser = state.players.filter(player => player.cards.length === 1)[0];
        return {
            ...state,
            loser,
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

    // O(n)
    function countPairs(arr: Card[]): number {
        let pairs = 0;
        const obj: any = {};
        arr.forEach(i => {
            if (obj[i.type]) {
                pairs += 1;
                obj[i.type] = 0;
            } else {
                obj[i.type] = 1;
            }
        });
        return pairs;
    }

    return countPairs(cards) > 0;
}

function newId(array: {id: number}[]): number {
    return array.reduce((acc: number, curr: {id:number}) => acc === curr.id ? acc + 1 : acc, 0);
}