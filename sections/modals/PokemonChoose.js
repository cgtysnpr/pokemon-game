import { Modal } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Image, Text, Grid } from "@mantine/core";
const PokemonChoose = ({
  opened,
  setOpened,
  time,
  setChoosedPokemons,
  choosedPokemons,
}) => {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonsData, setPokemonsData] = useState([]);

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const getPokemonDetails = async (pokemonName) => {
    await axios
      .get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      .then(function (response) {
        // handle success
        if (pokemonsData.length === 0) {
          setPokemons(response.data);
        } else {
          setPokemons([...pokemons, response.data]);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };
  const getPokemon = async () => {
    const offset = randomIntFromInterval(0, 1126);
    await axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=1&offset=${offset}`)
      .then(function (response) {
        // handle success
        (async () =>
          await getPokemonDetails(String(response.data.results[0].name)))();
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  useEffect(async () => {
    if (opened) {
      for (let i = 0; i < 10; i++) {
        (async () => await getPokemon())();
      }
    }
  }, [opened]);
  useEffect(() => {
    setPokemonsData([...pokemonsData, pokemons]);
  }, [pokemons]);
  const selectPokemon = (data) => {
    if (choosedPokemons.length < 3) {
      setChoosedPokemons([...choosedPokemons, data]);
    }
  };
  const unSelectPokemon = (data) => {
    const pokemonData = choosedPokemons.filter((pokeData) => {
      if (pokeData.id !== data.id) {
        return pokeData;
      }
    });
    setChoosedPokemons(pokemonData);
  };
  return (
    <>
      <Modal
        size="xl"
        opened={opened}
        onClose={() => setOpened(false)}
        title="Choose Your Pokemons"
        transition="rotate-left"
        transitionDuration={600}
        transitionTimingFunction="ease"
        centered
      >
        <Text size="sm">{time}</Text>
        {pokemonsData.length === 11 ? (
          <Grid>
            {pokemonsData.map((data, i) => {
              if (i === 0) {
                return;
              }
              return (
                <Grid.Col key={i} span={3}>
                  <Card
                    onClick={() => {
                      choosedPokemons.includes(data)
                        ? unSelectPokemon(data)
                        : selectPokemon(data);
                    }}
                    sx={
                      choosedPokemons.includes(data)
                        ? {
                            cursor: "pointer",
                            border: "1px solid #32CD32",
                            p: -5,
                          }
                        : {
                            cursor: "pointer",
                            "&:hover": { border: "1px solid #32CD32", p: -5 },
                          }
                    }
                    shadow="sm"
                    p="xl"
                    component="div"
                  >
                    <Card.Section>
                      <Image
                        src={data.sprites.front_default}
                        height={160}
                        alt="No way!"
                      />
                    </Card.Section>

                    <Text sx={{ whiteSpace: "nowrap" }} weight={500} size="lg">
                      {data.name}
                    </Text>

                    <Text size="sm">{data.types[0].type.name}</Text>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>
        ) : null}
      </Modal>
    </>
  );
};
export default PokemonChoose;
