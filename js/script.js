//=======================================================
//                   CONST DECLARATIONS
//=======================================================

// const { get } = require("express/lib/response");

const addPostBtn = document.getElementById("add-post-btn");
const imageURLInput = document.getElementById("image-url-input");
const titleInput = document.getElementById("title-input");
const locationInput = document.getElementById("location-input");
const captionInput = document.getElementById("caption-input");

// ===============================================================================
//                               SHOW ALL POSTS & RENDER
// ===============================================================================
const grid = document.getElementById("feed-grid-cont");

let showAllPosts = () => {
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/allWildlifePosts",
    success: (posts) => {
      console.log(posts);
      renderPosts(posts);
      runOpenPosts(posts);
    },
    error: (error) => {
      console.log(error);
    },
  });
};

let renderPosts = (wildlifePosts) => {
  // console.log("The render post function is running");
  grid.innerHTML = "";
  wildlifePosts.forEach((item, index) => {
    grid.innerHTML += `
      <div class="grid-item post">
        <div class="post-data-cont-top">
          <div class="post-avatar-cont">
            <img src="${item.author_image_url}">
          </div>
          <div class="post-like-cont">
            <i class="bi bi-heart"></i>
          </div>
        </div>
        <div class="post-data-cont-bottom">
          <i class="bi bi-geo-fill"></i>
          <h4 class="post-location">${item.location}</h4>
          <p class="view-more">View more</p>
        </div>
        <div class="post-hover"></div>
        <img src="${item.image_url}" alt="${item.name}" class="post-img">
      </div>
        `;
  });
};

showAllPosts();

// ==========================================================
//                         ADD POSTS
// ==========================================================

//===========================================================
//                   MODAL OPENING AND CLOSING
//===========================================================

closeCreateModal = document.getElementById("exit-modal-icon");

addPostBtn.onclick = () => {
  console.log("clicked!");
  $(".create-post-modal").css("display", "flex");
};

closeCreateModal.onclick = () => {
  console.log("closing");
  $(".create-post-modal").css("display", "none");
};

//===========================================================
//                   MODAL OPENING AND CLOSING
//===========================================================

renderPostBtn = document.getElementById("render-post-btn");

renderPostBtn.onclick = () => {
  console.log("clicked");
  if (imageURLInput.value == "") {
    console.log("Input is empty, please include something.");
  } else if (locationInput.value == "") {
    console.log("Input is empty, please include something.");
  } else if (titleInput.value == "") {
    console.log("Input is empty, please include something.");
  } else if (captionInput.value == "") {
    console.log("Input is empty, please include something.");
  } else {
    // let authorName = sessionStorage.userName
    // let authorImageURL = sessionStorage.profile_image_url
    // let authorID = sessionStorage.userID
    $.ajax({
      url: `http://localhost:3000/addWildlifePost`,
      // use the post type to create data somewhere
      // requesting to POST our data
      type: "POST",
      // we can send objects through to the backend, using the data argument
      data: {
        // the first property (i.e. the one on the left) called name has to be spelt exactly as the schema
        image_url: imageURLInput.value,
        title: titleInput.value,
        location: locationInput.value,
        caption: captionInput.value,
        author_name: sessionStorage.userName,
        author_image_url: sessionStorage.profileImg,
        author_id: sessionStorage.userID,
        // created: moment().format()
      },
      success: () => {
        console.log("A new post was added.");
        showAllPosts();
        runOpenPosts();
      },
      error: () => {
        console.log("Error: cannot reach the backend");
      },
    });
    $(".create-post-modal").css("display", "none");
  }
};

// ==========================================================================
//                         CHECK LOGIN CONDITIONS
// ==========================================================================
let checkLogin = () => {
  const userDetails = document.getElementById("user-details");
  let newPostBtn = document.getElementById("add-post-cont");
  let navContent;
  if (sessionStorage.userID) {
    // console.log(sessionStorage.userName);
    // console.log(sessionStorage);
    navContent = `
    <span id="username">@${sessionStorage.userName}</span>
    <img id="dp" src="${sessionStorage.profileImg}" alt="">
    <a href="#">
    <button id="nav-logout-button">Sign Out</button>
    </a>
    `;
  } else {
    navContent = `
    <a href="login.html">
    <button id="nav-login-button">Login/Signup</button>
    </a>
    `;
    newPostBtn.style.display = "none";
  }
  userDetails.innerHTML = navContent;
};

checkLogin();

//================
// Log Out Button
//================

const logoutBtn = document.getElementById("nav-logout-button");

let logOut = () => {
  console.log("You've logged out");
  sessionStorage.clear();
  window.location.reload();
};

if (sessionStorage.userID) {
  logoutBtn.onclick = () => logOut();
}

//===========================
// Post Modals — Open & Close
//===========================

const appBody = document.querySelector("body");
const postModal = document.getElementById("post-modal");

let runOpenPosts = (posts) => {
  let currentPosts = document.getElementsByClassName("post");
  for (let x = 0; x < currentPosts.length; x++) {
    currentPosts[x].onclick = () => {
      appBody.classList.add("page-disable");
      postModal.classList.add("active-post-modal");
      openPost(posts[x]);
    };
  }
};

let openPost = (thisPost) => {
  let postModalCont = document.getElementById("post-modal-cont");
  postModalCont.innerHTML = "";
  console.log(thisPost._id);

  let checkPermission = (y) => {
    if (y.author_id == sessionStorage.userID) {
      return `
          <i class="edit-post bi bi-pencil-square" id="${y._id}" data-bs-toggle="modal" data-bs-target="#editModal"></i>
          <i class="delete-post bi bi-trash3" id="${y._id}"></i>
          `;
    } else {
      return "";
    }
  };

  let populatePostModal = (thisPost) => {
    postModalCont.innerHTML = "";
    postModalCont.innerHTML = `
    <div class="img-cont">
      <img src="${thisPost.image_url}" alt="${thisPost.title}">
    </div>
    <div class="post-modal-content-cont">
      <div class="post-user-cont">
          <img class="post-user-img" src="${thisPost.author_image_url}">
          <div class="post-user-details">
            <h5 class="post-user-name">@${thisPost.author_name}</h5>
            <p class="post-location">${thisPost.location}</p>
          </div>
          <div class="post-interactions-cont">
            ${checkPermission(thisPost)}
            <i class="bi bi-heart"></i>
          </div>
          </div>
          <div id="post-caption-cont" class="post-caption-cont">
            <p class="caption">${thisPost.caption}</p>
            <p class="created-text"></p>
          </div>
          <div id="post-comments-cont" class="post-comments-cont">
          </div>
          <div class="post-add-comment-cont">
          ${checkLoginComment()}
          </div>
    </div>
    `;
  };

  let checkLoginComment = () => {
    if (sessionStorage.userID) {
      return `
      <img class="current-user-img" src="${sessionStorage.profileImg}">
      <input type="text" placeholder="Leave a comment..." id="comment-input" class="comment-input">
      <i id="post-new-comment" class="bi bi-send post-new-comment"></i>
      `;
    } else {
      return `
      <img class="current-user-img" src="http://www.avalanche.org.nz/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png">
      <input type="text" placeholder="Login to comment..." id="comment-input" class="comment-input not-logged-in">
      <i id="post-new-comment" class="bi bi-send post-new-comment not-logged-in"></i>
      `;
    }
  };

  populatePostModal(thisPost);

  let connectComments = (z) => {
    let postComments = document.getElementById("post-comments-cont");
    postComments.innerHTML = "";
    for (let i = 0; i < z.comments.length; i++) {
      postComments.innerHTML += `
                <div class="comment">
                <img class="comment-user-img" src="${z.comments[i].comment_author_image_url}">
                <div class="comment-content">
                <p><span class="comment-user-name">@${z.comments[i].comment_author_name}</span>${z.comments[i].text}</p>
                </div>
                </div>
          `;
    }
  };

  //===========================================================================
  //                              EDIT POSTS
  //===========================================================================

  let handleEditFunctionality = (wildlifePost, id) => {
    console.log(id);
    let postTitle = document.getElementById("postTitle");
    let postLocation = document.getElementById("postLocation");
    let postCaption = document.getElementById("postCaption");
    let imagePreview = document.getElementById("image-preview");
    postTitle.value = wildlifePost.title;
    postLocation.value = wildlifePost.location;
    postCaption.value = wildlifePost.caption;
    // imagePreview.innerHTML = `
    // <img src="${wildlifePost.image_url}" alt="${postTitle}">
    // `;
    console.log(`The ID was passed in ${id}`);
    // ===============================
    //        EDIT CLICK LISTENER
    // ===============================

    $("#updatePost").click(function () {
      console.log("clicked");
      event.preventDefault();
      let postId = wildlifePost._id;
      let postTitle = document.getElementById("postTitle").value;
      let postLocation = document.getElementById("postLocation").value;
      let postCaption = document.getElementById("postCaption").value;
      console.log(postId, postTitle, postLocation, postCaption);

      $.ajax({
        url: `http://localhost:3000/updatePost/${postId}`,
        type: "PATCH",
        data: {
          title: postTitle,
          location: postLocation,
          caption: postCaption,
        },
        success: (data) => {
          console.log();
          let updatePostInfo = (wildlifePost) => {
            wildlifePost.title = postTitle;
            wildlifePost.location = postLocation;
            wildlifePost.caption = postCaption;
            $.ajax({
              type: "GET",
              url: "http://localhost:3000/allWildlifePosts",
              success: () => {
                showAllPosts();
                openPost(wildlifePost);
                // populatePostModal(wildlifePost);
                connectComments(thisPost);
              },
              error: (error) => {
                console.log(error);
              },
            });
          };
          updatePostInfo(wildlifePost);
          $("#editModal").modal("hide");
          $("#updatePost").off("click");
        },
        error: () => {
          console.log("error: cannot update");
        },
      });
    });
  };

  // ===========================
  //         EDIT MODAL
  // ===========================

  populateEditModal = (selectedPostId) => {
    console.log(selectedPostId);
    $.ajax({
      url: `http://localhost:3000/wildlifePost/${selectedPostId}`,
      type: "GET",
      success: (wildlifePostData, selectedPostId) => {
        // console.log('student was found');
        // console.log(student);
        handleEditFunctionality(wildlifePostData, selectedPostId);
      },
      error: (error) => {
        console.log(error);
      },
    });
  };

  // thisPostId = thisPost._id;

  let deletePost = (postId) => {
    // use ajax and go to the delete route
    $.ajax({
      // Let's go to our route
      url: `http://localhost:3000/deleteWildlifePost/${postId}`,
      type: "DELETE",
      success: () => {
        console.log("HELLO THERE");
        // at this point, we can assume that the delete was successful
        showAllPosts();
      },
      error: () => {
        console.log("Cannot call API");
      },
    });
  };

  if (thisPost.author_id == sessionStorage.userID) {
    let editPostBtn = document.getElementsByClassName("edit-post");
    let deletePostBtn = document.getElementsByClassName("delete-post");
    for (let e = 0; e < editPostBtn.length; e++) {
      editPostBtn[e].onclick = () => {
        console.log("EDITED!");
        populateEditModal(thisPost._id);
      };
    }
    for (let d = 0; d < deletePostBtn.length; d++) {
      deletePostBtn[d].onclick = () => {
        console.log("DELETED!");
        let currentPostId = deletePostBtn[d].id;
        deletePost(currentPostId);
        appBody.classList.remove("page-disable");
        postModal.classList.remove("active-post-modal");
      };
    }
  }

  const sendCommentBtn = document.getElementById("post-new-comment");
  //add a click listener
  const commentInput = document.getElementById("comment-input");

  const postComments = document.getElementById("post-comments-cont");

  if (sessionStorage.userID) {
    sendCommentBtn.onclick = () => {
      console.log("clicked!");
      let postModalCont = document.getElementById("post-modal-cont");
      // console.log(wildlifePostId);
      $.ajax({
        url: `http://localhost:3000/postComment`,
        type: "POST",
        data: {
          // comment_id: sessionStorage.userID,
          text: commentInput.value,
          comment_author_id: sessionStorage.userID,
          comment_author_name: sessionStorage.userName,
          comment_author_image_url: sessionStorage.profileImg,
          wildlife_post_id: thisPost._id,
        },
        success: (data) => {
          console.log(data);
          console.log("comment placed successfully");
          showAllPosts();
          runOpenPosts();
          postNewComment(data);
          commentInput.value = "";
          function scrollBottom(element) {
            element.scroll({ top: element.scrollHeight, behavior: "smooth" });
            let postModalContCont = document.getElementById(
              "post-modal-content-cont"
            );
            postModalContCont.scroll({
              top: postModalContCont.scrollHeight,
              behavior: "smooth",
            });
          }
          scrollBottom(postModalCont);
        },
        error: () => {
          console.log("error cannot call API");
        },
      });
    };
  }

  let postNewComment = (data) => {
    let postComments = document.getElementById("post-comments-cont");
    postComments.innerHTML += `
    <div class="comment new-comment">
    <img class="comment-user-img" src="${data.comment_author_image_url}">
    <div class="comment-content">
    <p><span class="comment-user-name">@${data.comment_author_name}</span>${data.text}</p>
    </div>
    </div>
  `;
  };

  let closePostModal = () => {
    let closePostBtn = document.getElementById("exit-modal");
    closePostBtn.onclick = () => {
      appBody.classList.remove("page-disable");
      postModal.classList.remove("active-post-modal");
    };
  };

  connectComments(thisPost);

  closePostModal();
};
