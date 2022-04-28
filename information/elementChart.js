const elementChart = {
  normal: [
    {
      attackPlus: [],
      attackMinus: ["rock", "steel"],
      cantAttack: ["ghost"],
      defendPlus: ["fighting"],
      defendMinus: [],
      cantDefend: ["ghost"],
    },
  ],
  fire: [
    {
      attackPlus: ["grass", "ice", "bug", "steel"],
      attackMinus: ["fire", "water", "rock", "dragon"],
      cantAttack: [],
      defendPlus: ["water", "ground", "rock"],
      defendMinus: ["fire", "grass", "ice", "bug", "steel", "fairy"],
      cantDefend: [],
    },
  ],
  water: [
    {
      attackPlus: ["fire", "ground", "rock"],
      attackMinus: ["water", "grass", "dragon"],
      cantAttack: [],
      defendPlus: ["grass", "electric", ""],
      defendMinus: ["fire", "water", "ice", "steel"],
      cantDefend: [],
    },
  ],
  grass: [
    {
      attackPlus: ["water", "ground", "rock"],
      attackMinus: [
        "fire",
        "grass",
        "poison",
        "flying",
        "bug",
        "dragon",
        "steel",
      ],
      cantAttack: [],
      defendPlus: ["fire", "ice", "poison", "flying", "bug"],
      defendMinus: ["water", "grass", "electric", "ground", ""],
      cantDefend: [],
    },
  ],
  electric: [
    {
      attackPlus: ["water", "flying", ""],
      attackMinus: ["grass", "electric", "dragon"],
      cantAttack: ["ground"],
      defendPlus: ["ground"],
      defendMinus: ["electric", "flying", "steel"],
      cantDefend: [],
    },
  ],
  ice: [
    {
      attackPlus: ["grass", "ground", "flying", "dragon"],
      attackMinus: ["fire", "water", "ice", "steel"],
      cantAttack: [],
      defendPlus: ["fire", "fighting", "rock", "steel"],
      defendMinus: ["ice"],
      cantDefend: [],
    },
  ],
  fighting: [
    {
      attackPlus: ["normal", "ice", "rock", "dark", "steel"],
      attackMinus: ["poison", "flying", "psychic", "bug", "fairy"],
      cantAttack: ["ghost"],
      defendPlus: ["flying", "psychic", "fairy"],
      defendMinus: ["bug", "rock", "dark"],
      cantDefend: [],
    },
  ],
  poison: [
    {
      attackPlus: ["grass", "fairy"],
      attackMinus: ["poison", "ground", "rock", "ghost"],
      cantAttack: ["steel"],
      defendPlus: ["ground", "psychic"],
      defendMinus: ["grass", "fighting", "poison", "bug", "fairy"],
      cantDefend: [],
    },
  ],
  ground: [
    {
      attackPlus: ["fire", "electric", "poison", "rock", "steel"],
      attackMinus: ["grass", "bug", ""],
      cantAttack: ["flying"],
      defendPlus: ["water", "grass", "ice"],
      defendMinus: ["poison", "rock"],
      cantDefend: ["electric"],
    },
  ],
};
