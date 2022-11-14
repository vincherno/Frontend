const signupBtn = document.getElementById("signup-button-signup-page");
const usernameInput = document.getElementById("username-input-signup");
const passwordInput = document.getElementById("password-input-signup");
const profileImgInput = document.getElementById("image-input-signup");
const validationSignup = document.getElementById("validation-signup");

const server = "http://localhost:3000";

signupBtn.onclick = function () {
  event.preventDefault();

  let username = usernameInput.value;
  let password = passwordInput.value;
  let profileImg = profileImgInput.value;
  console.log("Your details:");
  console.log(username, password, profileImg);

  $.ajax({
    url: `${server}/registerUser`,
    type: "POST",
    data: {
      username: username,
      password: password,
      profile_image_url: profileImg,
    },
    success: function (user) {
      if (user !== "username exists") {
        console.log("nice you signed up");
        console.log(user);

        $.ajax({
          url: `${server}/loginUser`,
          type: "POST",
          data: {
            username: usernameInput.value,
            password: passwordInput.value,
          },
          success: function (user) {
            if (user == "user not found") {
              console.log("User not found, please register");
            } else if (user == "not authorised") {
              console.log("Incorrect password.");
            } else {
              console.log("logged in successfully. Logged in as:");
              console.log(user);
              // set the local storage (cookie) properties equal to the retrieved user data
              sessionStorage.setItem("userID", user._id);
              sessionStorage.setItem("userName", user.username);
              sessionStorage.setItem("profileImg", user.profile_image_url);
              // redirect automatically
              document.location.href = "index.html";
            } // end of ifs
          }, //end of inner success
          error: function () {
            console.log("error: cannot call api");
            alert("Unable to login - unable to call api");
          }, // end of error
        }); // end of inner ajax
      } else {
        console.log("username taken already. Please try another name");
        validationSignup.innerHTML = `
        <p>Username already taken. Please try another name</p>
        `;
      } //end of else, if register is successful - log user in ends
    }, // end of success
    error: function () {
      console.log("error: cannot call api");
    }, // end or error
  }); // end of ajax
}; //end of onclick
