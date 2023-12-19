import './App.css'
import useCardDeck, {Card} from "./hooks/use-card-deck";
import CardDeckWithStyling from "./components/deck";
import {useEffect, useMemo, useRef, useState} from "react";
import {calcScore, HandState, Winner} from "./helpers/blackjack";
import HealthBar from "./components/healthbar";

const MAX_DEALER_HP = 20
const MAX_PLAYER_HP = 20

function App() {
	const [dealerHP, setDealerHP] = useState(MAX_DEALER_HP)
	const [playerHP, setPlayerHP] = useState(MAX_PLAYER_HP)
  const playerDeck = useCardDeck()
	const dealerDeck = useCardDeck()
	const [playerAttack, setPlayerAttack] = useState(1)
	const [boostSuits, setBoostSuits] = useState(['Hearts', 'Diamonds'])
	const playerDrawnCount = useRef(0)

	useEffect(() => {
		newHand()
	}, [])

	useEffect(() => {
		for (let i = 0; i < playerDeck.drawn.length; i++) {
			const newlyDrawn = playerDeck.drawn[i]
			console.log('newlyDrawn', newlyDrawn)

			if (newlyDrawn) {
				if (boostSuits.includes(newlyDrawn.suit)) {
					setPlayerAttack((atk) => atk + 1)
				}
			}
		}
	}, [playerDeck.drawn])

	const game = useMemo<HandState>(() => {
		const yourScore = calcScore(playerDeck.drawn)
		const dealerScore = calcScore(dealerDeck.drawn)
		const dealerRevealed = dealerDeck.drawn.every(x => x.faceup)
		const dealerDone = dealerRevealed && dealerScore >= 17
		const bust = yourScore > 21
		let canEnd = dealerDone || bust
		let winner : Winner = null

		if (canEnd) {
			if (bust) {
				winner = 'dealer'
			}
			else if (dealerScore > 21) {
				winner = 'player'
			}
			else if (yourScore <= dealerScore) {
				winner = 'dealer'
			}
			else {
				winner = 'player'
			}
		}

		return {
			yourScore: yourScore,
			dealerScore: dealerScore,
			bust: bust,
			canDraw: !bust && dealerRevealed,
			winner,
			canEnd,
		}
	}, [playerDeck.drawn, dealerDeck.drawn])

	function newHand () {
  	playerDeck.discardDrawnCards()
		dealerDeck.discardDrawnCards()
		playerDeck.drawCard()
		playerDeck.drawCard()
		dealerDeck.drawCard()
		dealerDeck.drawCard(false)
	}

	function clickEndTurn () {
  	if (!game.canEnd) {
  		console.log('no')
  		return
		}

  	if (game.winner === 'player') {
  		setDealerHP(dealerHP - playerAttack)
		}
  	else {
  		setPlayerHP(playerHP - 1)
		}

  	newHand()
	}

  return (
    <div>
			<h1>Blackjack Roguelike</h1>
			<div>
				<HealthBar currentHealth={dealerHP} maxHealth={MAX_DEALER_HP} />
				<CardDeckWithStyling label={'Dealer'} score={game.dealerScore} {...dealerDeck} />
			</div>
			<hr className={'hr'} />
			<div>
				<HealthBar currentHealth={playerHP} maxHealth={MAX_PLAYER_HP} />
				<CardDeckWithStyling label={'You'} score={game.yourScore} {...playerDeck} />
			</div>
			<div>
				Your Attack: {playerAttack}.
				You get +1 when you draw {boostSuits.join(' or ')}.
			</div>
			<div>
				<button type={'button'} className={'btn btn-primary me-2'} onClick={() => newHand()}>New Hand</button>
				<button type={'button'} className={'btn btn-primary'} disabled={!game.canEnd} onClick={() => clickEndTurn()}>
					{game.canEnd
						? (game.winner === 'player' ? 'Win!' : 'Lose!')
						: 'Keep Going'
					}
				</button>
			</div>
			<pre className={'pt-4 w-full text-left'}>
				{JSON.stringify(game, null, 2)}
			</pre>
    </div>
  )
}

export default App
