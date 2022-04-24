import { Card, Image, Text, Box } from "@mantine/core";
import { HeartFill } from "@styled-icons/octicons";
import { Sword } from "@styled-icons/remix-fill";
import { ShieldFill } from "@styled-icons/bootstrap";
import styled from "styled-components";
const PokemonCards = ({ data }) => {
  return (
    <Card shadow="sm" p="xl" component="div">
      <Card.Section>
        <Image src={data.sprites.front_default} height={160} alt="No way!" />
      </Card.Section>

      <Text sx={{ whiteSpace: "nowrap" }} weight={500} size="lg">
        {data.name}
      </Text>

      <Text size="sm">{data.types[0].type.name}</Text>
      <Box sx={{ marginTop: 5, gap: 4, display: "flex" }}>
        {data.stats.map((statData) => (
          <>
            {statData.stat.name === "hp" ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
