import { Card, Image, Text } from "@mantine/core";
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
    </Card>
  );
};
export default PokemonCards;
