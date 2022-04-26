import { Card, Image, Text, Box } from "@mantine/core";
import { HeartFill } from "@styled-icons/octicons";
import { Sword } from "@styled-icons/remix-fill";
import { ShieldFill } from "@styled-icons/bootstrap";
import styled from "styled-components";
import { motion } from "framer-motion";
const PokemonCards = ({
  data,
  selectPokemonForRound,
  user,
  selectedPokemonForRound,
  isSelected,
  anotherPlayerSelectedPokemon,
  clickable,
}) => {
  return (
    <>
      {isSelected ? (
        <motion.div
          animate={{ y: 100, opacity: 1 }}
          transition={{
            delay: 0.5,
            x: { type: "spring", stiffness: 100 },
            default: { duration: 1 },
          }}
        >
          <Card
            onClick={
              user && clickable ? () => selectPokemonForRound(data) : null
            }
            sx={
              selectedPokemonForRound && selectedPokemonForRound.id === data.id
                ? {
                    border: "2px solid #32CD32",
                    p: -5,
                  }
                : user
                ? {
                    "&:hover": {
                      cursor: "pointer",
                      border: "2px solid #32CD32",
                      p: -5,
                    },
                  }
                : null
            }
            shadow="sm"
            p="xl"
            component="div"
          >
            <Card.Section>
              <Image src={data.sprite} height={160} alt="No way!" />
            </Card.Section>

            <Text sx={{ whiteSpace: "nowrap" }} weight={500} size="lg">
              {data.name}
            </Text>

            <Text size="sm">{data.type}</Text>
            <Box sx={{ marginTop: 5, gap: 4, display: "flex" }}>
              {data.stats.map((statData) => (
                <>
                  {statData.stat.name === "hp" ? (
                    <>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <RedHeathFill />
                        <Text>{statData.base_stat}</Text>
                      </Box>
                    </>
                  ) : null}
                  {statData.stat.name === "attack" ? (
                    <Box sx={{ display: "flex" }}>
                      <IconSword />
                      <Text>{statData.base_stat}</Text>
                    </Box>
                  ) : null}
                  {statData.stat.name === "defense" ? (
                    <Box sx={{ display: "flex" }}>
                      <IconShield />
                      <Text>{statData.base_stat}</Text>
                    </Box>
                  ) : null}
                </>
              ))}
            </Box>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          animate={
            anotherPlayerSelectedPokemon === data.id
              ? { y: 100, opacity: 1 }
              : { y: 0, opacity: 1 }
          }
          transition={{
            delay: 0.3,
            x: { type: "spring", stiffness: 100 },
            default: { duration: 1 },
          }}
        >
          <Card
            onClick={
              user && clickable ? () => selectPokemonForRound(data) : null
            }
            sx={
              selectedPokemonForRound && selectedPokemonForRound.id === data.id
                ? {
                    border: "2px solid #32CD32",
                    p: -5,
                  }
                : user && clickable
                ? {
                    "&:hover": {
                      cursor: "pointer",
                      border: "2px solid #32CD32",
                      p: -5,
                    },
                  }
                : null
            }
            shadow="sm"
            p="xl"
            component="div"
          >
            <Card.Section>
              <Image src={data.sprite} height={160} alt="No way!" />
            </Card.Section>

            <Text sx={{ whiteSpace: "nowrap" }} weight={500} size="lg">
              {data.name}
            </Text>

            <Text size="sm">{data.type}</Text>
            <Box sx={{ marginTop: 5, gap: 4, display: "flex" }}>
              {data.stats.map((statData) => (
                <>
                  {statData.stat.name === "hp" ? (
                    <>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <RedHeathFill />
                        <Text>{statData.base_stat}</Text>
                      </Box>
                    </>
                  ) : null}
                  {statData.stat.name === "attack" ? (
                    <Box sx={{ display: "flex" }}>
                      <IconSword />
                      <Text>{statData.base_stat}</Text>
                    </Box>
                  ) : null}
                  {statData.stat.name === "defense" ? (
                    <Box sx={{ display: "flex" }}>
                      <IconShield />
                      <Text>{statData.base_stat}</Text>
                    </Box>
                  ) : null}
                </>
              ))}
            </Box>
          </Card>
        </motion.div>
      )}
    </>
  );
};
export default PokemonCards;
const RedHeathFill = styled(HeartFill)`
  color: #fa5252;
  width: 25px;
  height: 25px;
`;
const IconSword = styled(Sword)`
  color: #228be6;
  width: 25px;
  height: 25px;
`;
const IconShield = styled(ShieldFill)`
  color: #fab005;
  width: 25px;
  height: 25px;
`;
