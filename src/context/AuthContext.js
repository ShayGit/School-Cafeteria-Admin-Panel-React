import createDataContext from "./createDataContext";
import firebase from "../config/firebase";
import server from "../api/server"

const authReducer = (state, action) => {
  switch (action.type) {
    case "signin":
      return { ...state, errorMessage: "", isLoggedIn: action.payload };
      case "set_loading":
      return { ...state, isLoading: action.payload };
    case "set_error":
      return { ...state, errorMessage: action.payload };
    case "set_logged_in":
      return { ...state, isLoggedIn: action.payload };
      case "set_users":
        return { ...state, users: action.payload };
    case "signout":
      return { ...state, errorMessage: "", isLoggedIn: false };
    default:
      return state;
  }
};

const signin = (dispatch) => async ({ email, password }) => {
  console.log("Signin");
  try {
    dispatch({ type: "set_error", payload: "" });

    await firebase.auth().signInWithEmailAndPassword(email, password);
    // const idToken = await  result.user.getIdToken();

    // server.post(
    //   "/setCustomClaims",
    //   {
    //     idToken: idToken,
    //   },
    //   (data, status) => {
    //     // This is not required. You could just wait until the token is expired
    //     // and it proactively refreshes.
    //     if (status === "success" && data) {
    //       const json = JSON.parse(data);
    //       if (json && json.status === "success") {
    //         // Force token refresh. The token claims will contain the additional claims.
    //         firebase.auth().currentUser.getIdToken(true);
    //       }
    //     }
    //   });

    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();
    console.log(idTokenResult.claims.admin);
    dispatch({ type: "signin", payload: idTokenResult.claims.admin });
    if (!idTokenResult.claims.admin)
      dispatch({ type: "set_error", payload: "Wrong Admin Account" });
  } catch (error) {
    dispatch({ type: "set_error", payload: error.message });
    console.log(error);
  }
};

const signout = (dispatch) => async () => {
  try {
    dispatch({ type: "set_loading", payload: true });
    console.log("signout");
    await firebase.auth().signOut();
    //dispatch({ type: "signout" });
  } catch (error) {
    console.log(error);
    alert("", error.message);
  }
};

const setLoggedIn = (dispatch) => async (isLoggedIn) => {
  try {
    dispatch({ type: "set_logged_in", payload: isLoggedIn });
    dispatch({ type: "set_loading", payload: false });

    console.log("setloggedin", isLoggedIn);
  } catch (error) {
    console.log(error);
  }
};

const getUsers = (dispatch) => async () => {
  try {
    const res = await server.get("/getUsers");
    dispatch({ type: "set_users", payload: res.data})

    //dispatch({ type: "set_logged_in", payload: isLoggedIn });
  } catch (error) {
    console.log(error);
  }
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    signout,
    setLoggedIn,
    getUsers,
  },
  {
    isLoading: true,
    users: [],
    errorMessage: "",
    isLoggedIn: false,
  }
);
