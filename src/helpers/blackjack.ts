import {Card} from "../hooks/use-card-deck";

export type Winner = 'player' | 'dealer' | null

export type HandState = {
	canDraw: boolean
	winner: Winner
	yourScore: number
	dealerScore: number
	bust: boolean
	canEnd: boolean
}

export const calcScore = (cards: Card[]) : number => {
	let score = 0;
	let numberOfAces = 0;

	for (const card of cards) {
		if (!card.faceup) {
			continue
		}

		switch (card.rank) {
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '10':
				score += parseInt(card.rank, 10);
				break;
			case 'J':
			case 'Q':
			case 'K':
				score += 10;
				break;
			case 'A':
				score += 11;
				numberOfAces += 1;
				break;
			default:
				break;
		}
	}

	// Adjust the score for Aces
	while (numberOfAces > 0 && score > 21) {
		score -= 10;
		numberOfAces -= 1;
	}

	return score;
}
