import {Immutable, produce} from "immer";
import {Card} from "./use-card-deck";

type CardArea = {
	deck: Card[]
	drawn: Card[]
	discarded: Card[]
}

type Character = {
	hp: number
	maxHP: number
	cards: CardArea
	name: string

}

// Pure game state, no computed values, no functions
// Should be JSON saveable
type GameState = Immutable<{
	player: Immutable<Character>
	enemy: Immutable<Character>
}>
