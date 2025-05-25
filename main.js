//------------------------------------------------------------
// CANVAS
//------------------------------------------------------------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const background = document.createElement("img");
background.src = "mission.png";

const container = document.getElementById("viewport");

// Scale is 1mm per px
let baseWidth = 2362;
let baseHeight = 1143;

let scale = 1;

function ResizeCanvas () {
  let widthRatio = container.clientWidth / baseWidth;
  let heightRatio = container.clientHeight / baseHeight;

  if (widthRatio <= heightRatio) {
    scale = widthRatio * 0.9;
  } 
  else {
    scale = heightRatio *0.9;
  }

  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;

  ctx.scale(scale, scale);
  ctx.drawImage(background, 0, 0, baseWidth, baseHeight);
}

//------------------------------------------------------------
// MATH
//------------------------------------------------------------
function RadToDeg (angle) {
  return angle * 180 / Math.PI;
}

function DegToRad (angle) {
  return angle * Math.PI / 180;
}

function CalculateDistance (p1, p2) {
  return Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
}

function CalculateAngle (p1, p2) {
  return RadToDeg(Math.atan2((p2.x - p1.x), (p1.y - p2.y)));
}

function FlipAngle (angle) {
  return -1 * Math.sign(angle) * (180 - Math.abs(angle))
}

function CalculateTurn (angle1, angle2) {
  return Math.sign((angle2 - angle1 + 540) % 360 - 180);
}

//------------------------------------------------------------
// POINTS
//------------------------------------------------------------
let currentPoint = null;
let holdingPoint = null;

let points = [];

function CreatePoint (x, y, d = 1, f = 0) {
  points.push({
    x: x,
    y: y,
    d: d,
    f: f,
  });
  currentPoint = points.length - 1;
}

let trash = [];

function DeletePoint () {
  if (points.length > 0) {
    trash.push(points.pop());
  }

  if (holdingPoint >= points.length) {
    holdingPoint = null;
  }
  if (currentPoint >= points.length) {
    currentPoint = null;
  }

  UpdatePointMenu();
}

function WipePoints () {
  points = [];
  currentPoint = null;
  holdingPoint = null;
}

function RestorePoint () {
  if (trash.length > 0) {
    points.push(trash.pop());
  }
}

function MovePointLeft () {
  if (currentPoint != null) {
    points[currentPoint].x -= 1;
    UpdatePointMenu();
  }
}

function MovePointRight () {
  if (currentPoint != null) {
    points[currentPoint].x += 1;
    UpdatePointMenu();
  }
}

function MovePointUp () {
  if (currentPoint != null) {
    points[currentPoint].y -= 1;
    UpdatePointMenu();
  }
}

function MovePointDown () {
  if (currentPoint != null) {
    points[currentPoint].y += 1;
    UpdatePointMenu();
  }
}

function SetPointForwards () {
  if (currentPoint != null) {
    points[currentPoint].d = 1;
    UpdatePointMenu();
  }
}

function SetPointBackwards () {
  if (currentPoint != null) {
    points[currentPoint].d = -1;
    UpdatePointMenu();
  }
}

function SetPointFunction (key) {
  if (currentPoint != null) {
    points[currentPoint].f = Number(key);
    UpdatePointMenu();
  }
}

//------------------------------------------------------------
// MOUSE
//------------------------------------------------------------
const mouse = {
  x: 0,
  y: 0,
}

canvas.onmousemove = function (e) {
  mouse.x = Math.round(e.offsetX / scale);
  mouse.y = Math.round(e.offsetY / scale);

  if (holdingPoint !== null) {
    points[holdingPoint].x = mouse.x;
    points[holdingPoint].y = mouse.y;
    
    UpdatePointMenu();
  }
}

canvas.onmousedown = function (e) {
  for (point of points) {
    if (CalculateDistance(point,mouse) <= 25) {
      holdingPoint = points.indexOf(point);
      currentPoint = points.indexOf(point);

      UpdatePointMenu();
    }
  }

  if (holdingPoint === null) {
    CreatePoint(mouse.x, mouse.y);
    
    holdingPoint = points.length - 1;
    currentPoint = points.length - 1;

    UpdatePointMenu();
  }
}

document.onmouseup = function (e) {
  holdingPoint = null;
}

//------------------------------------------------------------
// KEYBOARD
//------------------------------------------------------------
container.onkeyup = function (e) {
  let key = e.key;

  if (key === "Backspace") { DeletePoint(); }
  if (key === "Enter") { RestorePoint(); }
  if (key === "-") { SetPointBackwards(); }
  if (key === "=") { SetPointForwards(); }
  if (!isNaN(key)) { SetPointFunction(key); }
  if (key === "o") { ToggleShowOverlay(); }
  if (key === "i") { ToggleShowInfo(); }
  if (key === "p") { LoadPreviousSavedPoints(); }
  if (key === "q") { WipePoints(); }
}

container.onkeydown = function (e) {
  let key = e.key;

  if (key === "ArrowLeft") { MovePointLeft(); }
  if (key === "ArrowRight") { MovePointRight(); }
  if (key === "ArrowUp") { MovePointUp(); }
  if (key === "ArrowDown") { MovePointDown(); }
}

//------------------------------------------------------------
// MENU
//------------------------------------------------------------

// Select html elements
//------------------------------------------------------------
const menu = {
  formPoints: document.getElementById("point"),
  formSettings: document.getElementById("settings"),
  
  pointX : document.getElementById("PointX"),
  pointY : document.getElementById("PointY"),
  
  pointDF : document.getElementById("F"),
  pointDB : document.getElementById("B"),
  
  pointF : document.getElementById("PointF"),

  robotW : document.getElementById("RobotW"),
  overlay : document.getElementById("Overlay"),
  info: document.getElementById("Info"),

  routeD: document.getElementById("RouteD"),
  routeL: document.getElementById("RouteL"),
  routeC: document.getElementById("RouteC"),

  pointsD: document.getElementById("PointsD"),
  pointsL: document.getElementById("PointsL"),
  pointsC: document.getElementById("PointsC"),
  pointsT: document.getElementById("PointsT"),
  pointsI: document.getElementById("PointsI"),
  pointsF: document.getElementById("PointsF"),
};

// Prevent form submit
//------------------------------------------------------------
menu.formPoints.onsubmit = (e) => {e.preventDefault();};
menu.formSettings.onsubmit = (e) => {e.preventDefault();};

// Selected point menu onchange events
//------------------------------------------------------------
menu.pointX.onchange = function () {
  if (currentPoint != null) {
    points[currentPoint].x = menu.pointX.valueAsNumber;
  }
}
menu.pointY.onchange = function () {
  if (currentPoint != null) {
    points[currentPoint].y = menu.pointY.valueAsNumber;
  }
}
menu.pointDF.onchange = function () {
  if (currentPoint != null) {
    points[currentPoint].d = 1;
  }
}
menu.pointDB.onchange = function () {
  if (currentPoint != null) {
    points[currentPoint].d = -1;
  }
}
menu.pointF.onchange = function () {
  if (currentPoint != null) {
    points[currentPoint].f = menu.pointF.valueAsNumber;
  }
}

// Update point menu
//------------------------------------------------------------
function UpdatePointMenu () {
  if (currentPoint != null) {
    menu.pointX.value = points[currentPoint].x;
    menu.pointY.value = points[currentPoint].y;

    if (points[currentPoint].d === 1) {
      menu.pointDF.checked = true;
    }
    if (points[currentPoint].d === -1) {
      menu.pointDB.checked = true;
    }

    menu.pointF.value = points[currentPoint].f;
  }
  else if (currentPoint === null) {
    menu.pointX.value = "";
    menu.pointY.value = "";
    
    menu.pointDF.checked = false;
    menu.pointDB.checked = false;
    
    menu.pointF.value = "";
  }
}

// Settings menu onchange events
//------------------------------------------------------------
let robotWidth = 200;
let showOverlay = false;
let showInfo = true;

menu.robotW.onchange = function () {
  robotWidth = menu.robotW.valueAsNumber;
}

menu.overlay.onchange = function () {
  showOverlay = menu.overlay.checked;
}

menu.info.onchange = function () {
  showInfo = menu.info.checked;
}

function ToggleShowOverlay () {
  showOverlay = !showOverlay;
  UpdateSettingsMenu();
}

function ToggleShowInfo () {
  showInfo = !showInfo;
  UpdateSettingsMenu();
}

// Update settings menu
//------------------------------------------------------------
function UpdateSettingsMenu () {
  menu.robotW.value = robotWidth;
  menu.overlay.checked = showOverlay;
  menu.info.checked = showInfo;
}

// Export/Import menu onchange events
//------------------------------------------------------------
menu.routeD.onclick = function () {
  DownloadRoute();
}
menu.routeC.onclick = function () {
  CopyRoute();
}

menu.pointsD.onclick = function () {
  DownloadPoints();
}
menu.pointsC.onclick = function () {
  CopyPoints();
}
menu.pointsT.onchange = function () {
  ImportPointsFromText();
}
menu.pointsI.onclick = function () {
  UploadPointsFile();
}
menu.pointsF.onchange = function () {
  ImportPointsFromFile();
}

//------------------------------------------------------------
// EXPORT
//------------------------------------------------------------

// Export route
//------------------------------------------------------------
function ExportRoute () {
  let route = ``;
  
  for(let i = 0; i < (points.length - 1); i++) {
    const angle1 = i === 0 ? 0 : CalculateAngle(points[i-1], points[i]);
    let angle2 = CalculateAngle(points[i], points[i+1]);
    if (points[i].d === -1) { angle2 = FlipAngle(angle2); }
    let turn = CalculateTurn(angle1, angle2);
    if (i > 0) {
      if (points[i-1].d === -1 && points[i].d === 1) {
        turn *= -1;
      }
    }
    const distance = CalculateDistance(points[i], points[i+1]);
    const func = points[i].f;
    const direction = points[i].d;

    route += ``+turn+`\n`+Math.round(angle2)+`\n`+direction+`\n`+Math.round(distance)+`\n`+func+`\n`; 
    // turn, angle, direction, distance, function /////////////////////////////////////////////////
  }

  return route.trim();
}

function DownloadRoute () {
  let data = ExportRoute();
  let blob = new Blob([data], { type: 'text.plain' });
  let url = URL.createObjectURL(blob);

  menu.routeL.href = url;

  menu.routeL.click();
}

function CopyRoute () {
  navigator.clipboard.writeText(ExportRoute());
}

// Export points
//------------------------------------------------------------
function ExportPoints () {
  return JSON.stringify(points);
}

function DownloadPoints () {
  let data = ExportPoints();
  let blob = new Blob([data], { type: 'application/json' });
  let url = URL.createObjectURL(blob);

  menu.pointsL.href = url;

  menu.pointsL.click();
}

function CopyPoints () {
  navigator.clipboard.writeText(ExportPoints());
}

//------------------------------------------------------------
// IMPORT
//------------------------------------------------------------
function ImportPointsFromText () {

  try {
    json = JSON.parse(menu.pointsT.value);

    currentPoint = null;
    holdingPoint = null;
  }
  catch {
    json = null;
  }

  points = json !== null ? json : points;
  
}

function UploadPointsFile () {
  menu.pointsF.click();
}

function ImportPointsFromFile () {
  let fileReader = new FileReader();
  
  fileReader.onload = () => {

    try {
      json = JSON.parse(fileReader.result);

      currentPoint = null;
      holdingPoint = null;
    }
    catch {
      json = null;
    }

    points = json !== null ? json : points;
    
  };

  fileReader.readAsText(menu.pointsF.files[0]);
}

//------------------------------------------------------------
// SAVE
//------------------------------------------------------------
function SavePoints () {
  localStorage.setItem("Save",ExportPoints());
}

window.onbeforeunload = function () {
  SavePoints();
}

function LoadPreviousSavedPoints () {

  try {
    json = JSON.parse(localStorage.getItem("Save"));

    currentPoint = null;
    holdingPoint = null;
  }
  catch {
    json = null;
  }

  points = json !== null ? json : points;
}

//------------------------------------------------------------
// DRAW
//------------------------------------------------------------
function DrawPoints () {
  for (point of points) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.arc(point.x, point.y, 10, 0, 2*Math.PI);
    ctx.fill();
  }

  if (currentPoint !== null) {
    let point = points[currentPoint];
    ctx.beginPath();
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 3;
    ctx.arc(point.x, point.y, 20, 0, 2*Math.PI);
    ctx.stroke();
  }
}

function DrawLines () {
  ctx.beginPath();
  
  for (point of points) {
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 3;
    ctx.lineTo(point.x, point.y);
  }
  
  ctx.stroke();
}

function DrawOverlay () {
  if (showOverlay) {
    ctx.beginPath();
  
    for (point of points) {
      ctx.strokeStyle = "rgba(0,0,0,0.5)";
      ctx.lineWidth = robotWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineTo(point.x, point.y);
    }
    
    ctx.stroke();
  }
}

function DrawInfo () {
  if (showInfo) {
    for(let i = 0; i < points.length; i++) {
      ctx.beginPath();
      ctx.font = "bold 36px sans";
      ctx.textAlign = "center";
      
      if (i < (points.length - 1)) {
        let angle = CalculateAngle(points[i], points[i+1]);
        if (points[i].d === -1) { angle = FlipAngle(angle); }
        ctx.fillStyle = "rgb(255,0,255)";
        ctx.fillText(Math.round(angle), points[i].x, points[i].y - 24); // angle
  
        let distance = CalculateDistance(points[i], points[i+1]);
  
        let middle = {
          x: (points[i].x + points[i+1].x) / 2,
          y: (points[i].y + points[i+1].y) / 2,
        };
        
        ctx.fillStyle = "rgb(255,255,0)";
        ctx.fillText(Math.round(distance), middle.x, middle.y); // distance
  
        let angle1 = i === 0 ? 0 : CalculateAngle(points[i-1], points[i]);
        let angle2 = CalculateAngle(points[i], points[i+1]);
        if (points[i].d === -1) { angle2 = FlipAngle(angle2); }
        let turn = CalculateTurn(angle1, angle2);
        if (i > 0) {
          if (points[i-1].d === -1 && points[i].d === 1) {
            turn *= -1;
          }
        }
        ctx.fillStyle = "rgb(0,0,255)";
        ctx.fillText(turn, points[i].x + 36, points[i].y + 12); // turn
      }

      ctx.fillStyle = "rgb(255,0,0)";
      ctx.fillText(points[i].d, points[i].x - 36, points[i].y + 12); // direction
      
      ctx.fillStyle = "rgb(0,255,0)";
      ctx.fillText(points[i].f, points[i].x, points[i].y + 48); // function
      
      ctx.fill();
    }
  }
}
//------------------------------------------------------------
// LOOP
//------------------------------------------------------------
function loop () {
  ResizeCanvas();

  DrawPoints();
  DrawLines();
  DrawOverlay();
  DrawInfo();
}

document.body.onload = function () {
  UpdateSettingsMenu();
  setInterval(loop, 1000/60);
}
