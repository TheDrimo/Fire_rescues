import * as PIXI from 'pixi.js';


import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

const GAME_WIDTH = 1000;
const GAME_HEIGHT = 1000;

let playerId:number
let fires:{x,y}[]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div>
  <a href="https://vitejs.dev" target="_blank">
    <img src="${viteLogo}" class="logo" alt="Vite logo" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
  </a>
  <h1>Fire Rescue</h1>
  <p id="ws-data">
  </p>
</div>
`

const serverUrl =  'ws://192.168.1.31:8080';
const connection = new WebSocket(serverUrl);

connection.onopen = () => {
  // Connection established
  console.log('connection ok')
};



connection.onmessage = (message) => {
  // Handle incoming messages
  const data = JSON.parse(message.data);
  //console.log(data)

  if(data?.type === 'initialState') {
    playerId = data.playerId
    fires = data?.fires;
    document.querySelector<HTMLDivElement>('#ws-data')!.innerHTML = `data : ${data.type}<br/>player: ${playerId} <br/> fires : ${JSON.stringify(fires)}`
    drawFires();
  }

  if(data?.type === 'playerPosition') {
    const {x, y} = data;
    firefighter.position.x = x;
    firefighter.position.y = y;
  }

  if(data?.type === 'updateGrid') {
    console.log(data)
    fires=data?.grid;
    document.querySelector<HTMLDivElement>('#ws-data')!.innerHTML = `data : ${data.type}<br/>player: ${playerId} <br/> fires : ${JSON.stringify(fires)}`
    drawFires();
  }


};

let targetX: number = 0, targetY: number = 0;

// Create a PixiJS application of type canvas with specify background color and make it resize to the iframe window
const app = new PIXI.Application<HTMLCanvasElement>({ background: '#1099bb', width: GAME_WIDTH, height: GAME_HEIGHT});
app.view.addEventListener("mousemove", e => {
  targetX = e.offsetX;
  targetY = e.offsetY;
})

// Adding the application's view to the DOM
document.body.appendChild(app.view);


// create a new Sprite from an image path
const firefighter = new PIXI.Container();

const waterCircle = new PIXI.Graphics();
waterCircle.lineStyle(10, 0x0000FF, 1);
waterCircle.beginFill(0xC34288, 1);
waterCircle.drawCircle(0, 0, 20);
waterCircle.endFill();
firefighter.addChild(waterCircle);

const firefighterSprite = PIXI.Sprite.from('/firefighter.png');
firefighterSprite.height = 60
firefighterSprite.width = 60
firefighterSprite.anchor.set(0.5);
firefighter.addChild(firefighterSprite);

// add to stage
app.stage.addChild(firefighter);

// center the sprite's anchor point

// move the sprite to the center of the screen
firefighter.x = app.screen.width / 2;
firefighter.y = app.screen.height / 2;


app.ticker.add((delta) =>
{
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    //bunny.rotation += 0.1 * delta;
/*     bunny.position.x += (0.005 * targetX);
    bunny.position.y += (0.005 * targetY); */
    if(connection.readyState == connection.OPEN) {
      const payload = {type:'move', x:targetX, y:targetY, playerId }
      connection.send(JSON.stringify(payload))
    }
    //console.log(bunny.position)
});


let graphics: PIXI.Graphics;
function drawFires() {
  if(graphics) {
    graphics.destroy()
  }
  graphics = new PIXI.Graphics();
  
  graphics.lineStyle(10, 0xFFBD01, 1);
  graphics.beginFill(0xC34288, 1);
  fires?.forEach(({x,y}) => {
    graphics.drawCircle(x, y, 20);
  });
  graphics.endFill();

  app.stage.addChild(graphics);
}
