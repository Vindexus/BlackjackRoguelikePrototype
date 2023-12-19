import { useState, useEffect } from 'react';
import {produce} from 'immer';
import {shuffleArrayInPlace} from "../helpers/random";

export type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
	suit: Suit;
	rank: Rank;
	faceup: boolean
}

interface DeckState {
	deck: Card[];
	drawn: Card[];
	discarded: Card[];
}


const createDeck = (): Card[] => {
	const suits: Suit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
	const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

	const deck: Card[] = [];
	for (const suit of suits) {
		for (const rank of ranks) {
			deck.push({ suit, rank, faceup: false });
		}
	}

	return deck;
};

const createShuffledDeck = () : Card[] => {
	const deck = createDeck()
	shuffleArrayInPlace(deck)
	return deck
}

const useCardDeck = () => {
	const [state, setState] = useState<DeckState>({
		deck: createShuffledDeck(),
		drawn: [],
		discarded: [],
	});

	const drawCard = (faceup = true) => {
		if (state.deck.length === 0) {
			console.warn('No more cards to draw!');
			return;
		}

		setState(produce((draft) => {
			const [drawnCard, ...remainingDeck] = draft.deck;
			draft.deck = remainingDeck;
			draft.drawn.push({
				...drawnCard,
				faceup,
			});
		}));
	};

	const discardDrawnCards = () => {
		setState(produce((draft) => {
			draft.discarded.push(...draft.drawn);
			draft.discarded.forEach((card: Card) => {
				card.faceup = true
			})
			draft.drawn = [];
		}));
	};

	const flipCard = (idx: number) => {
		setState(produce((draft) => {
			draft.drawn[idx].faceup = true
		}));
	}

	return {
		deck: state.deck,
		drawn: state.drawn,
		discarded: state.discarded,
		drawCard,
		discardDrawnCards,
		flipCard,
	};
};

export default useCardDeck;
