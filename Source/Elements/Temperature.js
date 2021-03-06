
const COLD   = 0 // ...     -10C
const CHILLY = 1 // -10C to   0C
const COOL   = 2 //   0C to  15C
const ROOM   = 3 //  15C to  30C
const BODY   = 4 //  30C to  40C
const WARM   = 5 //  40C to 100C
const HOT    = 6 // 100C ...

SpaceTode`

element Temperature {
	
	//============//
	// Init Cache //
	//============//
	given i (selfElement) => selfElement.statesCache === undefined
	keep i (selfElement) => {
		const cache = {...(selfElement.states? selfElement.states() : {})}
		const chancesCache = {}
		for (const tempKey in cache) {
			const temp = cache[tempKey]
			if (temp.is(Array)) {
				cache[tempKey] = temp[0]
				chancesCache[tempKey] = temp[1]
			}
		}
		selfElement.statesChancesCache = chancesCache
		selfElement.statesCache = cache
	}
	i => i
	
	//==============//
	// Change State //
	//==============//
	select s (element) => element
	keep s (space, selfElement, selected) => {
		const selfTargets = selfElement.statesCache
		if (selfTargets === undefined) return
		
		let otherTemp = selected.temperature
		if (otherTemp === undefined) otherTemp = ROOM
		
		const selfTarget = selfTargets[otherTemp]
		if (selfTarget === undefined) return
		
		const selfChances = selfElement.statesChancesCache
		const selfChance = selfChances[otherTemp]
		if (selfChance !== undefined && Math.random() > selfChance) return
		
		SPACE.setAtom(space, new selfTarget(), selfTarget)
	}
	
	action any(xyz.directions) @s => s.
	
	given N (self, atom) => self !== atom
	N => .
}

`