// SETUP
let w, h;
let button;
function setup() {
  if (window.innerHeight - 24 < window.innerWidth * (480 / 640)) {
    h = window.innerHeight - 24;
    w = h * (640 / 480);
  } else {
    w = window.innerWidth;
    h = w * (480 / 640);
  }
  createCanvas(w, h);
  background(0);
  capture = createCapture(VIDEO);
  capture.hide();
  poseNet = ml5.poseNet(capture, modelLoaded);
  poseNet.on("pose", getPoses);
  capture.hide();
}

// WINDOW RESIZED FUNCTION
function windowResized() {
  if (window.innerHeight - 24 < window.innerWidth * (480 / 640)) {
    h = window.innerHeight - 24;
    w = h * (640 / 480);
  } else {
    w = window.innerWidth;
    h = w * (480 / 640);
  }
  resizeCanvas(w, h);
  background(0);
}

// MODEL LOADED FUNCTION
function modelLoaded() {
  //console.log("ok");
}

// GET POSES FUNCTION
let pose = [];
let skeleton = [];
function getPoses(poses) {
  pose = [];
  skeleton = [];
  for (let n = 0; n < poses.length; n++) {
    pose.push(poses[n].pose);
    skeleton.push(poses[n].skeleton);
  }
}

// DRAW FUNCTION
let ratio;
let col, fun;
let timer = 0;
function draw() {
  fun = color("rgba(0, 0, 0, 0.05)");
  col = color(255);
  fill(fun);
  noStroke();
  rect(0, 0, width, height);
  ratio = w / capture.width;
  translate(width, 0);
  scale(-ratio, ratio);
  if (pose) {
    drawKeypoints();
    drawSkeleton();
  }
}

// DRAW KEYPOINTS FUNCTION
let unit;
let str_size = 3;
let ell_size = 12;
let pose_score = 0.1;

// MUSIC
let lhip_var = [0, 0];
let dist_val = 0;
let rhand_var = 0;
let pitch_val = 0;
let pbrate_val = 1;
let nose_var = [0, 0];
let volume_val = 1;
let lhand_var = 0;

function drawKeypoints() {
  for (let n = 0; n < pose.length; n++) {
    if (pose[n].score > pose_score) {
      unit = dist(
        pose[n].leftEar.x,
        pose[n].leftEar.y,
        pose[n].rightEar.x,
        pose[n].rightEar.y
      );
      noFill();
      strokeWeight(str_size);
      stroke(col);
      let neck = createVector(
        (pose[n].leftShoulder.x + pose[n].rightShoulder.x) / 2,
        (pose[n].leftShoulder.y + pose[n].rightShoulder.y) / 2
      );
      let nose = createVector(pose[n].nose.x, pose[n].nose.y);
      let dif = createVector(neck.x - nose.x, neck.y - nose.y);
      let dis = dist(neck.x, neck.y, nose.x, nose.y);
      let sub = createVector(
        ((unit / 2) * dif.x) / dis,
        ((unit / 2) * dif.y) / dis
      );
      let chin = createVector(pose[n].nose.x + sub.x, pose[n].nose.y + sub.y);
      ellipse(nose.x, nose.y, unit);
      line(chin.x, chin.y, neck.x, neck.y);
      for (let i = 5; i < pose[n].keypoints.length; i++) {
        let keypoint = pose[n].keypoints[i];
        if (keypoint.score > pose_score) {
          fill(col);
          noStroke();
          ellipse(keypoint.position.x, keypoint.position.y, ell_size);
        }
      }
    }
  }
}

// DRAW SKELETON FUNCTION
function drawSkeleton() {
  for (let n = 0; n < pose.length; n++) {
    if (pose[n].score > pose_score) {
      for (let i = 0; i < skeleton[n].length; i++) {
        let a = skeleton[n][i][0];
        let b = skeleton[n][i][1];
        strokeWeight(str_size);
        stroke(col);
        noFill();
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }
  }
}
