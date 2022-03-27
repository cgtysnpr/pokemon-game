import React from "react";
import {
  createStyles,
  Container,
  Title,
  Text,
  Button,
  Grid,
} from "@mantine/core";
import { auth, db, provider } from "../firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import JoinCreateRoom from "../sections/modals/JoinCreateRoom";
const useStyles = createStyles((theme) => ({
  root: {
    backgroundColor: "#11284b",
    backgroundSize: "cover",
    backgroundImage: "url(images/hero.jpg)",
    paddingTop: theme.spacing.xl * 3,
    paddingBottom: theme.spacing.xl * 3,
    height: "100vh",
    width: "100vw",
    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  content: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontWeight: 900,
    lineHeight: 1.05,
    maxWidth: 500,
    fontSize: 48,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      fontSize: 34,
      lineHeight: 1.15,
    },
  },

  description: {
    color: theme.white,
    opacity: 0.75,
    maxWidth: 500,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
    },
  },

  control: {
    paddingLeft: 50,
    paddingRight: 50,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 22,

    [theme.fn.smallerThan("md")]: {
      width: "100%",
    },
  },
}));
export default function Home() {
  const [opened, setOpened] = useState(false);
  const [user] = useAuthState(auth);
  const { classes } = useStyles();
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className={classes.root}>
      <JoinCreateRoom setOpened={setOpened} opened={opened} />
      <Container align="center" justify="center">
        <Grid>
          <Grid.Col
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            md={12}
            lg={12}
          >
            <Title className={classes.title}>
              A{" "}
              <Text component="span" inherit>
                TURN BASED
              </Text>{" "}
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "pink", to: "yellow" }}
              >
                {" "}
                POKEMON GAME{" "}
              </Text>
            </Title>

            <Text className={classes.description} mt={10}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting,
            </Text>
          </Grid.Col>
          <Grid.Col
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            md={12}
            lg={6}
          >
            <Button
              variant="gradient"
              color={"yellow"}
              size="xl"
              className={classes.control}
            >
              How To Play?
            </Button>
            </Grid.Col>
            <Grid.Col
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
            md={12}
            lg={6}
          >
            <Button
              variant="gradient"
              gradient={{ from: "pink", to: "yellow" }}
              size="xl"
              className={classes.control}
              onClick={!user ? signIn : () => setOpened(true)}
            >
              {!user ? "Sign In / Sign Up" : "Create / Join Room"}
            </Button>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
