
var dog,happyDog;
var database;
var foodS,foodStock;
var dogImage;
var happyDogImage;

var fedTime, lastFed;
var feed, addFood;
var foodObj;
var gameState,readState;

var sadDog, bedroom, garden, washroom;

function preload()
{
dogImage=loadImage("images/dogImg1.png");
happyDogImage=loadImage("images/dogImg.png");
garden = loadImage("virtual pet images 2/ Garden.png")
washroom = loadImage("virtual pet images 2/ Wash Room.png")
bedroom = loadImage("virtual pet images 2/ Bed Room.png")
sadDog = loadImage("virtual pet images 2/ Dog.png")
}

function setup() {
  database = firebase.database();

  createCanvas(400, 500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  dog = createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  feed = createButton("Feed the Dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.postion(500,95);
  addFood.mousePressed(addFoods);  
}


function draw() {  
  currentTime = hour();

  if(currentTime == (lastFed + 1)){
      update("Playing");
      foodObj.garden();
  }
  else if(currentTime == (lastFed + 2)){
      update("Sleeping");
      foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
      update("Bathing");
      foodObj.washroom();
  }
  else{
    update("Hungry")
    foodObj.display();
  }
   
  if(gameState != "Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
  }
  else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog);
  }

  drawSprites();
}

  function readStock(data){
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  }

  function feedDog(){
    dog.addImage(happyDogImage);

    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
        Food: foodObj.getFoodStock(),
        FeedTime: hour(),
        gameState: "Hungry"
    })
  }
  
  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food : foodS
    })
  }

  function update(state){
    database.ref('/').update({
      gameState: state
    })
  }