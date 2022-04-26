import { Modal } from "@mantine/core";
import { TextInput, Grid, Button, Text } from "@mantine/core";
import randomstring from "randomstring";
import { auth, db, provider } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Alert } from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";
import { useRouter } from "next/router";
function JoinCreateRoom({ opened, setOpened }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [roomName, setRoomName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const createRoom = async () => {
    setLoading(true);
    let room = randomstring.generate(7);
    const roomsRef = db.collection("rooms");
    const roomCheck = await roomsRef.where("roomName", "==", room).get();
    if (roomCheck.empty) {
      db.collection("rooms").doc(room).set({
        roomName: room,
        playerOne: user.email,
        head: user.email,
        section: 0,
      });
      router.push(`/room/${room}`);
    } else {
      createRoom();
    }
  };
  const handleOnChange = (e) => {
    setRoomName(e);
    setAlert(false);
  };
  const joinRoom = async () => {
    const roomsRef = db.collection("rooms");
    const roomCheck = await roomsRef.where("roomName", "==", roomName).get();
    if (!roomCheck.empty) {
      var roomData = roomCheck.docs?.[0]?.data();
      if (!roomData.playerTwo && roomData.playerOne != user.email) {
        db.collection("rooms").doc(roomData.roomName).update({
          playerTwo: user.email,
        });
        router.push(`/room/${roomData.roomName}`);
      } else if (
        roomData.playerTwo == user.email ||
        roomData.playerOne == user.email
      ) {
        router.push(`/room/${roomData.roomName}`);
      } else {
        setTitle("Room is full");
        setDescription(`${roomName} is full! Please create new room.`);
        setAlert(true);
      }
    } else {
      setRoomName("");
      setTitle("Room does not exist!");
      setDescription(
        `${roomName} does not exist! Please enter existing room name.`
      );
      setAlert(true);
    }
  };
  return (
    <Modal
      size="xl"
      opened={opened}
      onClose={() => setOpened(false)}
      title="Create / Join Room"
      transition="rotate-left"
      transitionDuration={600}
      transitionTimingFunction="ease"
      centered
    >
      <Grid justify="center">
        {alert ? (
          <Grid.Col md={12}>
            <Alert
              icon={<AlertCircle size={16} />}
              title={title}
              color="red"
              variant="outline"
            >
              {roomName + description}
            </Alert>
          </Grid.Col>
        ) : null}

        <Grid.Col md={9}>
          <TextInput
            onChange={(e) => handleOnChange(e.target.value)}
            placeholder="Join Room"
            radius="md"
            size="md"
            value={roomName}
          />
        </Grid.Col>
        <Grid.Col md={3}>
          <Button
            onClick={joinRoom}
            sx={{ width: "100%" }}
            color="yellow"
            radius="xs"
            size="md"
          >
            JOIN
          </Button>
        </Grid.Col>
        <Text>or</Text>
        <Grid.Col md={12}>
          <Button
            onClick={createRoom}
            color="yellow"
            sx={{ width: "100%" }}
            radius="xs"
            size="md"
            loading={loading}
          >
            Create Room
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
export default JoinCreateRoom;
