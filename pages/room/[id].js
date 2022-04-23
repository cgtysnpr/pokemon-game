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
import { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import PokemonChoose from "../../sections/modals/PokemonChoose";

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
    borderRight: "4px solid #fff",
    [theme.fn.smallerThan("md")]: {
      borderBottom: "4px solid #fff",
      borderRight: "none",
    },
  },
}));
function Room({ roomName, roomData }) {
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
      time: 20,
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

        await delay(1000);
      }
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
                    color: "#fff",
                    "&:hover": {
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[5]
                          : theme.colors.gray[1],
                      color: "#000",
                    },
                  })}
                >
                  <Text>Players</Text>
                  <Text>{newRoomData.playerOne}</Text>
                  <Text>{newRoomData.playerTwo}</Text>
                </Box>
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col className={classes.playerSpaceOne} md={12} lg={6}>
                test
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
                test test
              </Grid.Col>
            </Grid>
            {user && newRoomData.head == user.email ? (
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
