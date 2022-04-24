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
import PokemonCards from "../../sections/game-screen/PokemonCards";
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
    backgroundSize: "cover",
    backgroundImage:
      "url(https://pokemon-game-smoky.vercel.app/images/room-background.jpg)",
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
        const res = await roomRef.update({
          playerOnePokemons: choosedPokemons,
          time: 20,
          section: 2,
          round: 1,
        });
        setOpened(false);
      } else {
        const res = await roomRef.update({
          playerTwoPokemons: choosedPokemons,
          time: 20,
          section: 2,
          round: 1,
        });
        setOpened(false);
      }
    }
    if (
      newRoomData &&
      newRoomData.section == 2 &&
      newRoomData.time > 0 &&
      newRoomData.head === user.email
    ) {
      await delay(1000);
      const roomRef = db.collection("rooms").doc(roomData.roomName);
      const res = await roomRef.update({
        time: newRoomData.time - 1,
      });
    }
  }, [newRoomData]);
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
              <Grid.Col sx={{ justifyContent: "flex-start" }} md={3}>
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
                  <Text>Players</Text>
                  <Text>{newRoomData.playerOne}</Text>
                  <Text>{newRoomData.playerTwo}</Text>
                </Box>
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
              <Grid.Col className={classes.playerSpaceOne} md={12} lg={6}>
                {newRoomData.playerOne === user.email &&
                newRoomData.playerOnePokemons ? (
                  <Grid>
                    {newRoomData.playerOnePokemons.map((data, i) => (
                      <>
                        <Grid.Col span={4}>
                          <PokemonCards data={data} />
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
                          <PokemonCards data={data} />
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
                          <PokemonCards data={data} />
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
                          <PokemonCards data={data} />
                        </Grid.Col>
                      </>
                    ))}
                  </Grid>
                ) : null}
              </Grid.Col>
            </Grid>
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
