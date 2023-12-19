import {Card} from "../hooks/use-card-deck";
import DiamondsIcon from '../assets/diamonds.svg?react'
import HeartsIcon from '../assets/hearts.svg?react'
import SpadesIcon from '../assets/spades.svg?react'
import ClubsIcons from '../assets/clubs.svg?react'

const ICONS = {
	diamonds: DiamondsIcon,
	hearts: HeartsIcon,
	spades: SpadesIcon,
	clubs: ClubsIcons,
}

const PlayingCard: React.FC<{ card: Card, onClick: Function }> = ({ card, onClick }) => {
	const suit = card.suit.toLowerCase()
	const suitIcon = <div className={`card-suit ${suit}`}>
		{ICONS[suit]()}
	</div>
	return (
		<div onClick={() => onClick()} className={`playing-card ${card.suit.toLowerCase()} ${card.faceup ? 'faceup' : 'facedown'}`}>
			<div className={'card-cover'}></div>
			{suitIcon}
			<div className="card-rank">{card.rank}</div>
			{suitIcon}
		</div>
	);
};


type DeckProps = {
	drawn: Card[]
	discarded: Card[]
	deck: Card[]
	flipCard: (idx: number) => void
	drawCard: () => void
}

const CardDeckWithStyling: React.FC = ({drawn, label, discarded, deck, score, flipCard, drawCard}: DeckProps) => {
	const fuzzy = drawn.some(x => !x.faceup)
	return (
		<div className={'deck'}>
			<div className="deck-info">
				<div className="info-card">
					<div className="card-back">{discarded.length}</div>
					<div className="info-label">Discarded</div>
				</div>
				<div className="info-card info-remaining" onClick={() => {
					if (fuzzy) {
						return
					}
					drawCard()
				}}>
					<div className="card-back">{deck.length}</div>
					<div className="info-label">Cards Left</div>
				</div>
			</div>
			<div>
				<div className={'score'}>{label}: {fuzzy ? '~' : ''}{score}</div>

				<div className="active-cards">
					{drawn.map((card, index) => (
						<PlayingCard key={index} card={card} onClick={() => {
							flipCard(index)
						}} />
					))}
				</div>
			</div>
		</div>
	);
};

export default CardDeckWithStyling;
