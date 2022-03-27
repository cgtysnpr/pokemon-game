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
    backgroundImage: "url(https://pokemon-game-smoky.vercel.app/images/room-background.jpg)",
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
  }
}));
function Room({ roomName, roomData }) {
  const router = useRouter();
  const [newRoomData, setNewRoomData] = useState([]);
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
        console.log("test");
      } else if (!roomData.playerTwo) {
        db.collection("rooms").doc(roomData.roomName).update({
          playerTwo: user.email,
        });
      } else {
        router.push(`/`);
      }
    }
  }, [user]);

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
              <Grid.Col
                className={classes.playerSpaceOne}
                md={12} lg={6}
              >
                test
              </Grid.Col>
              <Grid.Col
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "center",
                  alignItems: "center",
                }}
                md={12} lg={6}
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
                  <Button variant="filled" color="dark" size="xl">
                    START
                  </Button>
                </Grid.Col>
              </Grid>
            ) : null}
          </>
        ) : null}
      </motion.div>
    </>
  );
}
export default Room;
