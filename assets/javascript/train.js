// Train Schedule: Homework 7
 // Using Firebase, create a train schedule
 //   and the ability to add a new train
 //  First display the schedule of trains already in the database
 //     update the Next Arrival time and the Minutes
 //    Away for each train on the screen.
 //  

 // 1. Global Variables and Functions
 var counting = 0;
 var disptrainFirstTime = [];
 var disptrainFrequency = [];
 var checkingThatDataExists = 0;
 
 // function to update the next train times on the page
 function updateTableEntry(){
    // dispValues[0] is the Next Arrival
    // dispValues[1] is the Minutes Away
    var dispValues = [];
    var x = document.getElementById("train-table").rows.length;
    var i;
    for (i = 1; i < x; i++){
       var temp1 = i - 1;
       dispValues = getNextArrivalMinAway(disptrainFrequency[temp1],disptrainFirstTime[temp1]);
       (document.getElementById("train-table").rows[i].cells[3].innerHTML) = dispValues[0];
       (document.getElementById("train-table").rows[i].cells[4].innerHTML) = dispValues[1];
    }
 };
 
 // function that calculate the next arrival time information based on the 
 //    frequency and first train time 
 function getNextArrivalMinAway(calctrainFrequency,calctrainFirstTime) {
 
    // nuValues stores the calculated information to be returned.
    var nuValues = [];
 
    // set the passed values
    var tFrequency = calctrainFrequency;
    // Time 
    var firstTime = calctrainFirstTime;
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
    // Current Time
    var currentTime = moment();
    //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency; 
    // Minute Until Train  
    var tMinutesTillTrain = tFrequency - tRemainder;
  
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // to display ("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
 
    nuValues[0] = moment(nextTrain).format("hh:mm");
    nuValues[1] = tMinutesTillTrain;
  
    return (nuValues);
 };
 
 // function to concatinate the four separated numbers of the time HH:MM
 function getTheFirstTrainTimeFormatted(FirstTrainHour1,FirstTrainHour2,FirstTrainMin1,FirstTrainMin2) {
   var tempFullTimeDisp = "";
   
    var tempHour1 = FirstTrainHour1.toString();  
    var tempHour2 = FirstTrainHour2.toString(); 
    var tempMin1 = FirstTrainMin1.toString();
    var tempMin2 = FirstTrainMin2.toString();
    tempFullTimeDisp = tempHour1 + tempHour2 + ":" + tempMin1 + tempMin2;
    return tempFullTimeDisp;
 };
 
 
  // 2. Initialize Firebase
  var config = {
    apiKey: "AIzaSyCiWLqdjbVXbRAeg-Yv4XJk_AsBFgeDo_s",
    authDomain: "train-project-7907e.firebaseapp.com",
    databaseURL: "https://train-project-7907e.firebaseio.com",
    projectId: "train-project-7907e",
    storageBucket: "train-project-7907e.appspot.com",
    messagingSenderId: "896365889742"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();
 
 
  // 3. Display train information that is already in the database
  // Create Firebase event for retrieving a train from the database and add row in the html when a user adds an entry
  database.ref('/schedule').on("child_added", function(childSnapshot, prevChildKey) {
  
    // Store everything into a variable.
     
    var disptrainName = childSnapshot.val().name;
    var disptrainDestination = childSnapshot.val().destination;
    disptrainFirstTime[counting] = childSnapshot.val().traintime;
    disptrainFrequency[counting] = childSnapshot.val().tfrequency;
  
    //  Info
    var tempDispValues = [];
    tempDispValues = getNextArrivalMinAway(disptrainFrequency[counting],disptrainFirstTime[counting]);
 
    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + disptrainName + "</td><td>" + disptrainDestination + "</td><td>" +
       disptrainFrequency[counting] + "</td><td>" + tempDispValues[0] + "</td><td>" + tempDispValues[1]+ "</td></tr>");
    
    // increment counting which keeps tabs on the number of rows   
    counting = counting + 1;
    checkingThatDataExists = 1;
     
  });
  
 // 4.  Event for updating the table every 1 minute to show when a train will arrive
 
 function update() {
     
     // make sure there is data in the database first
     if (checkingThatDataExists = 1) {
       updateTableEntry();
    }
 };
 
 setInterval(function(){update();},60000);
 
 
 // 5. Button for adding Train
  $("#add-train-btn").on("click", function() {
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var FirstTrainHour1Time = $("#firsthour1-input").val();
    var FirstTrainHour2Time = $("#firsthour2-input").val();
    var FirstTrainMin1Time = $("#firstmin1-input").val();
    var FirstTrainMin2Time = $("#firstmin2-input").val();
 
    // transform trainFirstTrainTime to the form of HH:MM using the
    var trainFirstTrainTime = getTheFirstTrainTimeFormatted(FirstTrainHour1Time,FirstTrainHour2Time,FirstTrainMin1Time,FirstTrainMin2Time);
    var trainFrequency = $("#frequency-input").val();
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      destination: trainDestination,
      traintime: trainFirstTrainTime,
      tfrequency: trainFrequency
    };
  
    // sends train data to the database
    database.ref('/schedule').push(newTrain);
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#firsthour1-input").val("");
    $("#firsthour2-input").val("");
    $("#firstmin1-input").val("");
    $("#firstmin2-input").val("");
    $("#frequency-input").val("");
 
  
    // Prevents moving to new page
    return false;
  });	
 