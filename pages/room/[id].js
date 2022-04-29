import { motion } from "framer-motion";
import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  Grid,
  Box,
} from "@mantine/core";
import { Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import PokemonChoose from "../../sections/modals/PokemonChoose";
import styled from "styled-components";
import PokemonCards from "../../sections/game-screen/PokemonCards";
import Dice from "react-dice-roll";
import { Sword } from "@styled-icons/remix-fill";
import { ShieldFill } from "@styled-icons/bootstrap";
export async function getServerSideProps(context) {
  const roomsRef = db.collection("rooms");
  const roomName = context.query.id;
  const roomCheck = await roomsRef.where("roomName", "==", roomName).get();
  if (roomCheck) {
    var roomData = roomCheck.docs?.[0]?.data();
  }
  return {
    props: {
      roomData: roomData,
      roomName: roomName,
    }, // will be passed to the page component as props
  };
}

const useStyles = createStyles((theme) => ({
  backGround: {
    padding: theme.spacing.xl * 3,
    height: "100vh",
    width: "100vw",
    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },
  playerSpaceOne: {
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    [theme.fn.smallerThan("md")]: {
      borderBottom: "4px solid #fff",
      borderRight: "none",
    },
  },
}));
function Room({ roomName, roomData }) {
  const [choosedPokemons, setChoosedPokemons] = useState([]);
  const [opened, setOpened] = useState(false);
  const [newRoomData, setNewRoomData] = useState([]);
  const [selectedPokemonForRound, setSelectedPokemonForRound] = useState([]);
  const [clickable, setClickable] = useState(false);
  const [diceValue, setDiceValue] = useState(0);
  const [canDice, setCanDice] = useState(true);
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", async function (e) {
      e.preventDefault();
      const roomRef = db.collection("rooms").doc(roomData.roomName);
      if (newRoomData.playerOne == user.email && newRoomData.playerTwo) {
        const res = await roomRef.update({
          head: newRoomData.playerTwo,
          playerOne: newRoomData.playerTwo,
          playerTwo: "",
        });
      } else if (newRoomData.playerTwo == user.email) {
        const res = await roomRef.update({
          head: newRoomData.playerOne,
          playerTwo: "",
        });
      }
    });
  }

  const router = useRouter();

  const { classes } = useStyles();
  const [room] = useCollection(
    db.collection("rooms").where("roomName", "==", roomName)
  );
  useEffect(() => {
    if (room) {
      setNewRoomData(room.docs?.[0]?.data());
    }
  }, [room]);
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      if (
        roomData.playerOne == user.email ||
        (roomData.playerTwo == user.email && roomData.playerTwo)
      ) {
      } else if (!roomData.playerTwo) {
        db.collection("rooms").doc(roomData.roomName).update({
          playerTwo: user.email,
        });
      } else {
        router.push(`/`);
      }
    }
  }, [user]);
  const gameStarted = async () => {
    const roomRef = db.collection("rooms").doc(roomData.roomName);
    const res = await roomRef.update({
      section: 1,
      time: 15,
      started: true,
    });
  };
  async function delay(ms) {
    // return await for better async stack trace support in case of errors.
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }
  useEffect(async () => {
    if (newRoomData && newRoomData.time > 0 && newRoomData.section == 1) {
      if (!opened) {
        setOpened(true);
      }
      if (newRoomData.time > 0 && newRoomData.head == user.email) {
        await delay(1000);
        const roomRef = db.collection("rooms").doc(roomData.roomName);
        const res = await roomRef.update({
          time: newRoomData.time - 1,
        });
      }
    }
    if (newRoomData && newRoomData.time === 0 && newRoomData.section == 1) {
      const roomRef = db.collection("rooms").doc(roomData.roomName);
      if (newRoomData.playerOne === user.email) {
        var insertData = new Array();
        choosedPokemons.map((choosedPokemonData, i) => {
          var data = {
            id: choosedPokemonData.id,
            sprite: choosedPokemonData.sprites.front_default,
            name: choosedPokemonData.name,
            stats: choosedPokemonData.stats,
            type: choosedPokemonData.types[0].type.name,
          };
          insertData.push(data);
        });
        setOpened(false);
        const res = await roomRef.update({
          playerOnePokemons: insertData,
          time: 20,
          section: 2,
          round: 1,
          roundType: 0,
        });
      } else {
        var insertData = new Array();
        choosedPokemons.map((choosedPokemonData, i) => {
          var data = {
            id: choosedPokemonData.id,
            sprite: choosedPokemonData.sprites.front_default,
            name: choosedPokemonData.name,
            stats: choosedPokemonData.stats,
            type: choosedPokemonData.types[0].type.name,
          };
          insertData.push(data);
        });
        setOpened(false);
        const res = await roomRef.update({
          playerTwoPokemons: insertData,
        });
      }
    }
    if (
      newRoomData &&
      newRoomData.section == 2 &&
      newRoomData.time > 0 &&
      newRoomData.roundType === 0
    ) {
      setClickable(true);
      if (newRoomData.head === user.email) {
        if (!newRoomData.attacker && !newRoomData.defender) {
          let attacker = Math.floor(Math.random() * 2 + 1);
          if (attacker === 1) {
            const roomRef = db.collection("rooms").doc(roomData.roomName);
            const res = await roomRef.update({
              attacker: newRoomData.playerOne,
              defender: newRoomData.playerTwo,
            });
          } else {
            const roomRef = db.collection("rooms").doc(roomData.roomName);
            const res = await roomRef.update({
              attacker: newRoomData.playerTwo,
              defender: newRoomData.playerOne,
            });
          }
        }
        await delay(1000);
        const roomRef = db.collection("rooms").doc(roomData.roomName);
        const res = await roomRef.update({
          time: newRoomData.time - 1,
        });
      }
    }
    if (
      newRoomData &&
      newRoomData.section == 2 &&
      newRoomData.time === 0 &&
      newRoomData.roundType === 0
    ) {
      setClickable(false);
      const roomRef = db.collection("rooms").doc(roomData.roomName);
      if (newRoomData.playerOne === user.email) {
        const res = await roomRef.update({
          playerOneSelectedPokemon: selectedPokemonForRound.id,
          roundType: 1,
          time: 10,
        });
      }
      if (newRoomData.playerTwo === user.email) {
        const res = await roomRef.update({
          playerTwoSelectedPokemon: selectedPokemonForRound.id,
        });
      }
    }
    if (
      newRoomData &&
      newRoomData.section == 2 &&
      newRoomData.time > 0 &&
      newRoomData.roundType === 1
    ) {
      if (newRoomData.head === user.email) {
        await delay(1000);
        const roomRef = db.collection("rooms").doc(roomData.roomName);
        const res = await roomRef.update({
          time: newRoomData.time - 1,
        });
      }
    }
  }, [newRoomData]);
  const selectPokemonForRound = (data) => {
    setSelectedPokemonForRound(data);
  };
  const dice = async (value) => {
    setDiceValue(value);
    const roomRef = db.collection("rooms").doc(roomData.roomName);
    setCanDice(false);
    if (newRoomData.playerOne === user.email) {
      const res = await roomRef.update({
        playerOneDiceValue: value,
      });
    } else {
      const res = await roomRef.update({
        playerTwoDiceValue: value,
      });
    }
  };
  useEffect(() => {
    if (newRoomData && user) {
      if (newRoomData.playerOne === user.email) {
        if (newRoomData.playerOneDiceValue) {
          setCanDice(false);
        } else {
          setCanDice(true);
        }
      } else {
        if (newRoomData.playerTwoDiceValue) {
          setCanDice(false);
        } else {
          setCanDice(true);
        }
      }
    }
  }, [newRoomData]);
  useEffect(() => {
    document.getElementsByTagName("body")[0].style =
      "background-size: cover;background-image:url(https://pokemon-game-smoky.vercel.app/images/room-background.jpg);";
  }, []);
  return (
    <>
      <motion.div
        className={classes.backGround}
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.5 }}
      >
        {newRoomData.roomName && user ? (
          <>
            <Grid pb={20}>
              <Grid.Col
                sx={{ display: "flex", justifyContent: "space-between" }}
                md={12}
              >
                <Box
                  sx={(theme) => ({
                    border: "2px solid #fff",
                    textAlign: "center",
                    padding: theme.spacing.xl,
                    borderRadius: theme.radius.md,
                    cursor: "pointer",
                    color: "#181818",
                    backgroundColor: theme.colors.gray[1],
                  })}
                >
                  <Text>{user.email}</Text>
                </Box>
                {newRoomData.playerOne && newRoomData.playerTwo ? (
                  <Box
                    sx={(theme) => ({
                      border: "2px solid #fff",
                      textAlign: "center",
                      padding: theme.spacing.xl,
                      borderRadius: theme.radius.md,
                      cursor: "pointer",
                      color: "#181818",
                      backgroundColor: theme.colors.gray[1],
                    })}
                  >
                    <Text>
                      {newRoomData.playerOne !== user.email
                        ? newRoomData.playerOne
                        : newRoomData.playerTwo}
                    </Text>
                  </Box>
                ) : null}
              </Grid.Col>
            </Grid>
            {newRoomData.section > 1 ? (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    top: "10%",
                    left: "50%",
                    backgroundColor: "#fff",
                    padding: 15,
                    borderRadius: "10px",
                  }}
                >
                  <Text size="xl" weight={700}>
                    {newRoomData.time}
                  </Text>
                </Box>
                <Image
                  width={200}
                  sx={{ position: "absolute", left: "45%", top: "28%" }}
                  src="/images/vs-png.png"
                  alt="vs"
                />
              </>
            ) : null}
            <Grid>
              <Grid.Col
                sx={{ display: "flex", justifyContent: "center" }}
                sm={6}
              >
                {newRoomData && newRoomData.attacker === user.email ? (
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: "#fff",
                      padding: 5,
                      borderRadius: "8px",
                      alignItems: "center",
                    }}
                  >
                    <IconSword />
                    <Text size="xl">{"Attacker"}</Text>
                  </Box>
                ) : null}
                {newRoomData && newRoomData.defender === user.email ? (
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: "#fff",
                      padding: 5,
                      borderRadius: "8px",
                      alignItems: "center",
                    }}
                  >
                    <IconShield />
                    <Text size="xl">{"Defender"}</Text>
                  </Box>
                ) : null}
              </Grid.Col>
              <Grid.Col
                sx={{ display: "flex", justifyContent: "center" }}
                sm={6}
              >
                {newRoomData &&
                newRoomData.attacker &&
                newRoomData.attacker !== user.email ? (
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: "#fff",
                      padding: 5,
                      borderRadius: "8px",
                      alignItems: "center",
                    }}
                  >
                    <IconSword />
                    <Text size="xl">{"Attacker"}</Text>
                  </Box>
                ) : null}
                {newRoomData &&
                newRoomData.attacker &&
                newRoomData.defender !== user.email ? (
                  <Box
                    sx={{
                      display: "flex",
                      backgroundColor: "#fff",
                      padding: 5,
                      borderRadius: "8px",
                      alignItems: "center",
                    }}
                  >
                    <IconShield />
                    <Text size="xl">{"Defender"}</Text>
                  </Box>
                ) : null}
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col className={classes.playerSpaceOne} md={12} lg={6}>
                {newRoomData.playerOne === user.email &&
                newRoomData.playerOnePokemons ? (
                  <Grid>
                    {newRoomData.playerOnePokemons.map((data, i) => (
                      <>
                        <Grid.Col span={4}>
                          <PokemonCards
                            selectedPokemonForRound={selectedPokemonForRound}
                            selectPokemonForRound={selectPokemonForRound}
                            user={true}
                            data={data}
                            isSelected={
                              (newRoomData &&
                                newRoomData.section == 2 &&
                                newRoomData.time > 0 &&
                                selectedPokemonForRound &&
                                selectedPokemonForRound.id === data.id) ||
                              (newRoomData &&
                                newRoomData.section == 2 &&
                                selectedPokemonForRound &&
                                selectedPokemonForRound.id === data.id &&
                                newRoomData.roundType === 1)
                                ? true
                                : false
                            }
                            clickable={clickable}
                          />
                        </Grid.Col>
                      </>
                    ))}
                  </Grid>
                ) : null}
                {newRoomData.playerTwo === user.email &&
                newRoomData.playerTwoPokemons ? (
                  <Grid>
                    {newRoomData.playerTwoPokemons.map((data, i) => (
                      <>
                        <Grid.Col span={4}>
                          <PokemonCards
                            selectedPokemonForRound={selectedPokemonForRound}
                            selectPokemonForRound={selectPokemonForRound}
                            user={true}
                            data={data}
                            isSelected={
                              (newRoomData &&
                                newRoomData.section == 2 &&
                                newRoomData.time > 0 &&
                                selectedPokemonForRound &&
                                selectedPokemonForRound.id === data.id) ||
                              (newRoomData &&
                                newRoomData.section == 2 &&
                                selectedPokemonForRound &&
                                selectedPokemonForRound.id === data.id &&
                                newRoomData.roundType === 1)
                                ? true
                                : false
                            }
                            clickable={clickable}
                          />
                        </Grid.Col>
                      </>
                    ))}
                  </Grid>
                ) : null}
              </Grid.Col>
              <Grid.Col
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                }}
                md={12}
                lg={6}
              >
                {newRoomData.playerOne !== user.email &&
                newRoomData.playerOnePokemons ? (
                  <Grid>
                    {newRoomData.playerOnePokemons.map((data, i) => (
                      <>
                        <Grid.Col span={4}>
                          <PokemonCards
                            anotherPlayerSelectedPokemon={
                              newRoomData.playerOneSelectedPokemon
                                ? newRoomData.playerOneSelectedPokemon
                                : null
                            }
                            data={data}
                          />
                        </Grid.Col>
                      </>
                    ))}
                  </Grid>
                ) : null}
                {newRoomData.playerTwo !== user.email &&
                newRoomData.playerTwoPokemons ? (
                  <Grid>
                    {newRoomData.playerTwoPokemons.map((data, i) => (
                      <>
                        <Grid.Col span={4}>
                          <PokemonCards
                            anotherPlayerSelectedPokemon={
                              newRoomData.playerTwoSelectedPokemon
                                ? newRoomData.playerTwoSelectedPokemon
                                : null
                            }
                            data={data}
                          />
                        </Grid.Col>
                      </>
                    ))}
                  </Grid>
                ) : null}
              </Grid.Col>
            </Grid>
            {newRoomData &&
            newRoomData.roundType === 1 &&
            newRoomData.section === 2 ? (
              <Grid sx={{ marginTop: 120 }}>
                <Grid.Col
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                  sm={6}
                >
                  <motion.div
                    animate={
                      newRoomData.time === 0
                        ? { x: -300, opacity: 1 }
                        : { y: 0, opacity: 1 }
                    }
                    transition={{
                      delay: 0.3,
                      x: { type: "spring", stiffness: 100 },
                      default: { duration: 1 },
                    }}
                  >
                    <Dice
                      onRoll={(value) => dice(value)}
                      disabled={!canDice}
                      size={100}
                    />
                  </motion.div>
                </Grid.Col>
                {newRoomData &&
                newRoomData.roundType === 1 &&
                newRoomData.time === 0 ? (
                  <Grid.Col
                    sx={{ display: "flex", justifyContent: "flex-start" }}
                    sm={6}
                  >
                    {newRoomData.playerOneDiceValue ||
                    newRoomData.playerTwoDiceValue ? (
                      <motion.div
                        animate={
                          newRoomData.time === 0
                            ? { x: 300, opacity: 1 }
                            : { y: 0, opacity: 1 }
                        }
                        transition={{
                          delay: 0.3,
                          x: { type: "spring", stiffness: 100 },
                          default: { duration: 1 },
                        }}
                      >
                        <Dice
                          disabled={true}
                          size={100}
                          defaultValue={
                            newRoomData.playerOne === user.email
                              ? Number(newRoomData.playerTwoDiceValue)
                              : Number(newRoomData.playerOneDiceValue)
                          }
                        />
                      </motion.div>
                    ) : null}
                  </Grid.Col>
                ) : null}
              </Grid>
            ) : null}
            {user &&
            newRoomData.head == user.email &&
            newRoomData.section === 0 ? (
              <Grid pt={20}>
                <Grid.Col
                  md={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => gameStarted()}
                    variant="filled"
                    color="dark"
                    size="xl"
                    disabled={
                      newRoomData &&
                      newRoomData.playerOne &&
                      newRoomData.playerTwo
                        ? false
                        : true
                    }
                  >
                    START
                  </Button>
                </Grid.Col>
              </Grid>
            ) : null}
          </>
        ) : null}
        {opened ? (
          <PokemonChoose
            setChoosedPokemons={setChoosedPokemons}
            choosedPokemons={choosedPokemons}
            time={newRoomData.time}
            opened={opened}
            setOpened={setOpened}
          />
        ) : null}
      </motion.div>
    </>
  );
}
export default Room;
const IconSword = styled(Sword)`
  color: #228be6;
  width: 50px;
  height: 50px;
`;
const IconShield = styled(ShieldFill)`
  color: #fab005;
  width: 50px;
  height: 50px;
`;
